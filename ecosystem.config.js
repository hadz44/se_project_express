// PM2 Ecosystem Configuration for WTWR Backend
// Run with: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'wtwr-backend',
      script: './app.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
        MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wtwr_db',
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
