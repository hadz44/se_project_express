#!/bin/bash

# PM2 Restart Script for WTWR Backend
# Usage: ./restart.sh

cd /home/doshka44_gmail_com/apps/items   # or wherever your backend lives

pm2 restart all   # or pm2 restart <your-app-name>

