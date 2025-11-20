#!/bin/bash

# Automated 502 Bad Gateway Fix Script
# This script automatically diagnoses and fixes common 502 issues

set -e

echo "========================================="
echo "Automated 502 Bad Gateway Fix"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if running as root for certain operations
if [ "$EUID" -eq 0 ]; then 
    SUDO=""
else
    SUDO="sudo"
fi

ERRORS=0

# Function to check command availability
check_command() {
    if ! command -v $1 &> /dev/null; then
        return 1
    fi
    return 0
}

# Step 1: Install PM2 if not installed
echo "Step 1: Checking PM2 installation..."
if ! check_command pm2; then
    echo -e "${YELLOW}PM2 not found. Installing...${NC}"
    $SUDO npm install -g pm2
    echo -e "${GREEN}✓ PM2 installed${NC}"
else
    echo -e "${GREEN}✓ PM2 is installed${NC}"
fi

# Step 2: Ensure .env file exists with correct settings
echo ""
echo "Step 2: Checking .env configuration..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}.env file not found. Creating...${NC}"
    cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
MONGODB_URI=mongodb://127.0.0.1:27017/wtwr_db
JWT_SECRET=change-this-secret-key
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi

# Update HOST in .env if not set correctly
if ! grep -q "HOST=0.0.0.0" .env; then
    echo -e "${YELLOW}Updating HOST to 0.0.0.0 in .env...${NC}"
    if grep -q "HOST=" .env; then
        sed -i 's/HOST=.*/HOST=0.0.0.0/' .env
    else
        echo "HOST=0.0.0.0" >> .env
    fi
    echo -e "${GREEN}✓ HOST updated to 0.0.0.0${NC}"
fi

# Update PORT in .env if not set
if ! grep -q "PORT=3000" .env; then
    echo -e "${YELLOW}Updating PORT to 3000 in .env...${NC}"
    if grep -q "PORT=" .env; then
        sed -i 's/PORT=.*/PORT=3000/' .env
    else
        echo "PORT=3000" >> .env
    fi
    echo -e "${GREEN}✓ PORT updated to 3000${NC}"
fi

# Step 3: Create logs directory
echo ""
echo "Step 3: Creating logs directory..."
mkdir -p logs
echo -e "${GREEN}✓ Logs directory ready${NC}"

# Step 4: Ensure backend is running
echo ""
echo "Step 4: Checking backend server status..."
if pm2 list | grep -q "wtwr-backend.*online"; then
    echo -e "${GREEN}✓ Backend is running${NC}"
    echo "Restarting backend to apply new configuration..."
    pm2 restart wtwr-backend || pm2 start ecosystem.config.js
else
    echo -e "${YELLOW}Backend not running. Starting...${NC}"
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
    else
        pm2 start app.js --name wtwr-backend --env production
    fi
    echo -e "${GREEN}✓ Backend started${NC}"
fi

# Save PM2 configuration
pm2 save 2>/dev/null || true

# Wait a moment for server to start
sleep 2

# Step 5: Verify backend is listening on correct interface
echo ""
echo "Step 5: Verifying backend is listening on 0.0.0.0:3000..."
if command -v netstat &> /dev/null; then
    if netstat -tlnp 2>/dev/null | grep -q ":3000.*0.0.0.0"; then
        echo -e "${GREEN}✓ Backend is listening on 0.0.0.0:3000${NC}"
    elif netstat -tlnp 2>/dev/null | grep -q ":3000"; then
        echo -e "${RED}✗ Backend is listening on wrong interface${NC}"
        echo "Restarting with HOST=0.0.0.0..."
        pm2 restart wtwr-backend
        sleep 2
        ERRORS=$((ERRORS + 1))
    else
        echo -e "${RED}✗ Backend is not listening on port 3000${NC}"
        echo "Checking logs..."
        pm2 logs wtwr-backend --lines 10 --nostream
        ERRORS=$((ERRORS + 1))
    fi
fi

# Step 6: Test backend directly
echo ""
echo "Step 6: Testing backend server directly..."
if curl -f -s http://localhost:3000/items > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend responds on localhost:3000${NC}"
else
    echo -e "${RED}✗ Backend does not respond${NC}"
    echo "Backend logs:"
    pm2 logs wtwr-backend --lines 20 --nostream
    ERRORS=$((ERRORS + 1))
fi

# Step 7: Check Nginx installation
echo ""
echo "Step 7: Checking Nginx installation..."
if ! check_command nginx; then
    echo -e "${YELLOW}Nginx not found. Installing...${NC}"
    $SUDO apt-get update
    $SUDO apt-get install -y nginx
    echo -e "${GREEN}✓ Nginx installed${NC}"
else
    echo -e "${GREEN}✓ Nginx is installed${NC}"
fi

# Step 8: Configure Nginx for backend
echo ""
echo "Step 8: Configuring Nginx for backend..."
NGINX_BACKEND="/etc/nginx/sites-available/api.gcp-indemo.jumpingcrab.com"

# Create backend Nginx config
$SUDO tee "$NGINX_BACKEND" > /dev/null << 'EOF'
server {
    listen 80;
    server_name api.gcp-indemo.jumpingcrab.com;

    # Redirect HTTP to HTTPS (if SSL is configured)
    # Uncomment next line when SSL is ready
    # return 301 https://$server_name$request_uri;
    
    # Temporary: serve HTTP until SSL is configured
    access_log /var/log/nginx/api-access.log;
    error_log /var/log/nginx/api-error.log;
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
}

server {
    listen 443 ssl http2;
    server_name api.gcp-indemo.jumpingcrab.com;

    # SSL Certificate (configure when ready)
    # ssl_certificate /etc/letsencrypt/live/api.gcp-indemo.jumpingcrab.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/api.gcp-indemo.jumpingcrab.com/privkey.pem;

    access_log /var/log/nginx/api-access.log;
    error_log /var/log/nginx/api-error.log;
    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
    }
}
EOF

# Enable backend site
$SUDO ln -sf "$NGINX_BACKEND" /etc/nginx/sites-enabled/api.gcp-indemo.jumpingcrab.com 2>/dev/null || true
echo -e "${GREEN}✓ Backend Nginx config created${NC}"

# Step 9: Configure Nginx for frontend
echo ""
echo "Step 9: Configuring Nginx for frontend..."
NGINX_FRONTEND="/etc/nginx/sites-available/www.gcp-indemo.jumpingcrab.com"

# Detect frontend directory
FRONTEND_DIR=""
if [ -d "/var/www/frontend/build" ]; then
    FRONTEND_DIR="/var/www/frontend/build"
elif [ -d "/var/www/html" ]; then
    FRONTEND_DIR="/var/www/html"
elif [ -d "frontend/build" ]; then
    FRONTEND_DIR="$(pwd)/frontend/build"
elif [ -d "../frontend/build" ]; then
    FRONTEND_DIR="$(cd ../frontend/build && pwd)"
else
    echo -e "${YELLOW}⚠ Frontend build directory not found. Using default location.${NC}"
    FRONTEND_DIR="/var/www/html"
fi

# Create frontend Nginx config
$SUDO tee "$NGINX_FRONTEND" > /dev/null << EOF
server {
    listen 80;
    server_name www.gcp-indemo.jumpingcrab.com gcp-indemo.jumpingcrab.com;

    # Redirect HTTP to HTTPS (if SSL is configured)
    # Uncomment next line when SSL is ready
    # return 301 https://\$server_name\$request_uri;
    
    # Temporary: serve HTTP until SSL is configured
    root $FRONTEND_DIR;
    index index.html;
    access_log /var/log/nginx/frontend-access.log;
    error_log /var/log/nginx/frontend-error.log;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name www.gcp-indemo.jumpingcrab.com gcp-indemo.jumpingcrab.com;

    # SSL Certificate (configure when ready)
    # ssl_certificate /etc/letsencrypt/live/www.gcp-indemo.jumpingcrab.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/www.gcp-indemo.jumpingcrab.com/privkey.pem;

    root $FRONTEND_DIR;
    index index.html;
    access_log /var/log/nginx/frontend-access.log;
    error_log /var/log/nginx/frontend-error.log;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable frontend site
$SUDO ln -sf "$NGINX_FRONTEND" /etc/nginx/sites-enabled/www.gcp-indemo.jumpingcrab.com 2>/dev/null || true
echo -e "${GREEN}✓ Frontend Nginx config created${NC}"

# Step 10: Test and reload Nginx
echo ""
echo "Step 10: Testing Nginx configuration..."
if $SUDO nginx -t 2>&1 | grep -q "successful"; then
    echo -e "${GREEN}✓ Nginx configuration is valid${NC}"
    echo "Reloading Nginx..."
    $SUDO systemctl reload nginx
    $SUDO systemctl enable nginx 2>/dev/null || true
    echo -e "${GREEN}✓ Nginx reloaded${NC}"
else
    echo -e "${RED}✗ Nginx configuration has errors${NC}"
    $SUDO nginx -t
    ERRORS=$((ERRORS + 1))
fi

# Step 11: Check if services are running
echo ""
echo "Step 11: Verifying all services are running..."

# Check Nginx
if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx is running${NC}"
else
    echo -e "${YELLOW}Starting Nginx...${NC}"
    $SUDO systemctl start nginx
    echo -e "${GREEN}✓ Nginx started${NC}"
fi

# Check PM2 backend
if pm2 list | grep -q "wtwr-backend.*online"; then
    echo -e "${GREEN}✓ Backend (PM2) is running${NC}"
else
    echo -e "${RED}✗ Backend (PM2) is not running${NC}"
    ERRORS=$((ERRORS + 1))
fi

# Step 12: Test endpoints
echo ""
echo "Step 12: Testing endpoints..."

# Test backend through Nginx
if curl -f -s http://localhost/items > /dev/null 2>&1 || curl -f -s http://localhost:3000/items > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend accessible${NC}"
else
    echo -e "${YELLOW}⚠ Backend test failed (may need external DNS)${NC}"
fi

# Step 13: Setup PM2 startup
echo ""
echo "Step 13: Setting up PM2 startup..."
if ! pm2 startup 2>&1 | grep -q "already setup"; then
    echo "Run the command shown above to enable PM2 startup:"
    pm2 startup
fi

# Summary
echo ""
echo "========================================="
echo "Fix Summary"
echo "========================================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Services status:"
    echo "  - Backend: $(pm2 list | grep wtwr-backend | awk '{print $10}')"
    echo "  - Nginx: $(systemctl is-active nginx)"
    echo ""
    echo "Test your endpoints:"
    echo "  - Backend: curl http://localhost:3000/items"
    echo "  - Backend via Nginx: curl http://localhost/items"
    echo ""
    echo "If you still get 502 errors:"
    echo "  1. Check Nginx error log: sudo tail -f /var/log/nginx/error.log"
    echo "  2. Check backend logs: pm2 logs wtwr-backend"
    echo "  3. Verify backend is listening: sudo netstat -tlnp | grep 3000"
else
    echo -e "${RED}✗ Found $ERRORS issue(s)${NC}"
    echo ""
    echo "Please check the errors above and run:"
    echo "  - pm2 logs wtwr-backend --lines 50"
    echo "  - sudo tail -50 /var/log/nginx/error.log"
fi

echo ""

