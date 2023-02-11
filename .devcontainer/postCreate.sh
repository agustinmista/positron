#!/bin/bash

set -e

# Install Electron dependencies
sudo apt update
sudo apt install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libgtk3.0-cil libgbm1 libasound2 wine64

# Install dev environment
npm install

# Fix permissions of chrome-sandbox
# sudo chown -f root:root /workspaces/positron/node_modules/electron/dist/chrome-sandbox
# sudo chmod -f 4755 /workspaces/positron/node_modules/electron/dist/chrome-sandbox
