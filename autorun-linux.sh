#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RECOMMENDED_NODE_VERSION="22.13.1"
MYSQL_USER="root"

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
    echo "You are using Node.js v$CURRENT_NODE_VERSION. Recommended: v$RECOMMENDED_NODE_VERSION."
fi

if ! command -v mysql &> /dev/null; then
    echo "MySQL is not installed. Installing MySQL..."
    apt install -y mysql-server
    systemctl enable mysql
    systemctl start mysql
    echo "MySQL installed and started."
else
    echo "MySQL is already installed."
fi

echo "Installing npm dependencies..."
npm install || { echo "Failed to install npm dependencies!"; exit 1; }

echo

if [[ -f .env ]]; then
    echo ".env already exists. Skipping copy."
else
    echo "Copying .env.example to .env..."
    cp .env.example .env

    if [[ -f .env ]]; then
        echo "Successfully copied .env.example to .env."
    else
        echo "ERROR: Failed to copy .env.example to .env!"
        echo "Please copy the file manually using: cp .env.example .env"
        exit 1
    fi
fi

echo

read -p "Do you want to migrate the database? (y/n): " MIGRATE
if [[ "$MIGRATE" == "y" ]]; then
    echo "Running database migration..."
    mysql -u $MYSQL_USER -p < "$SCRIPT_DIR/database/migrations/250220-rddb.migration.sql"
    echo "Migration completed."
fi

read -p "Do you want to run the database seeder? (y/n): " SEED
if [[ "$SEED" == "y" ]]; then
    echo "Running database seeder..."
    mysql -u $MYSQL_USER -p < "$SCRIPT_DIR/database/seeders/250220-rddb.seeder.sql"
    echo "Seeding completed."
fi

read -p "Setup complete! Do you want to start the server? (y/n): " RUNSERVER
if [[ "$RUNSERVER" == "y" ]]; then
    echo "Starting the server..."
    npm run start || { echo "Failed to start the server!"; exit 1; }
else
    echo "Skipping server start."
fi

echo "Setup complete!"
