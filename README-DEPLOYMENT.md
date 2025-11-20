# Quick Fix for 502 Bad Gateway

## Automatic Fix

To automatically fix 502 Bad Gateway errors on your server, run:

```bash
# SSH into your Google Cloud VM
ssh your-username@your-server-ip

# Navigate to your project directory
cd /path/to/se_project_express-main

# Make the fix script executable
chmod +x fix-502.sh

# Run the automated fix script
./fix-502.sh
```

This script will:

1. ✅ Install PM2 if missing
2. ✅ Create/update .env file with correct settings (HOST=0.0.0.0, PORT=3000)
3. ✅ Ensure backend server is running on PM2
4. ✅ Configure Nginx for both frontend and backend
5. ✅ Test and reload Nginx
6. ✅ Verify all services are running

## What the Script Does

- **Backend Configuration**: Ensures backend listens on `0.0.0.0:3000` (not just localhost)
- **Nginx Backend Config**: Creates `/etc/nginx/sites-available/api.gcp-indemo.jumpingcrab.com`
- **Nginx Frontend Config**: Creates `/etc/nginx/sites-available/www.gcp-indemo.jumpingcrab.com`
- **PM2 Setup**: Keeps backend running even after server restart
- **Service Verification**: Tests all endpoints and reports status

## Manual Checks (if script doesn't work)

```bash
# Check if backend is running
pm2 status

# Check if backend is listening on correct port
sudo netstat -tlnp | grep 3000
# Should show: 0.0.0.0:3000 (NOT 127.0.0.1:3000)

# Test backend directly
curl http://localhost:3000/items

# Check Nginx status
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check backend logs
pm2 logs wtwr-backend
```

## Important Notes

1. **Run on Server**: All commands must be run on your Linux server (Google Cloud VM), not your local Windows machine
2. **SSH First**: You must SSH into your server before running these commands
3. **Root Access**: Some commands require sudo, make sure your user has sudo privileges
