#!/bin/bash

set -e

RECOMMENDED_NODE_VERSION="22.13.1"

if [[ $EUID -ne 0 ]]; then
    echo "Please run this script as root (using sudo)."
    exit 1
fi

if [[ ! -f package.json ]]; then
    echo "Error: package.json not found. Please run this script in your project directory."
    exit 1
fi

echo "Updating package lists..."
apt update && apt upgrade -y

if ! command -v curl &> /dev/null; then
    echo "Installing curl..."
    apt install -y curl
fi

if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Installing Node.js v$RECOMMENDED_NODE_VERSION..."
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt install -y nodejs

    if [[ "$(node -v | cut -d 'v' -f 2)" != "$RECOMMENDED_NODE_VERSION" ]]; then
        echo "Node.js installation failed!"
        exit 1
    else
        echo "Node.js v$RECOMMENDED_NODE_VERSION installed successfully."
    fi
else
    CURRENT_NODE_VERSION=$(node -v | cut -d 'v' -f 2)
    echo "You are using Node.js v$CURRENT_NODE_VERSION. We recommend using Node.js v$RECOMMENDED_NODE_VERSION."
fi

echo "Installing npm dependencies..."
if ! npm install; then
    echo "Failed to install npm dependencies!"
    exit 1
fi

echo "Setup complete!"
