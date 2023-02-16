#!/bin/bash

set -e

# Install system dependencies
sudo dpkg --add-architecture i386
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
  libgl1-mesa-glx \
  libgtk3.0-cil \
  libnss3 \
  mono-complete \
  rpm \
  wine \
  wine32 \
  wine64 \
  zip

# Install NVM via cURL
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Install Node.js
nvm install --lts