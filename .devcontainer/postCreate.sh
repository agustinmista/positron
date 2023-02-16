#!/bin/bash

set -e

# Install system dependencies
sudo apt update
sudo apt install -y --no-install-recommends \
  dpkg \
  fakeroot \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk3.0-cil \
  libnss3 \
  mono-complete \
  rpm \
  wine64

# Fix permissions of chrome-sandbox
# sudo chown -f root:root /workspaces/positron/node_modules/electron/dist/chrome-sandbox
# sudo chmod -f 4755 /workspaces/positron/node_modules/electron/dist/chrome-sandbox
