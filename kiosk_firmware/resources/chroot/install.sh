#!/bin/bash
set -e

npm install -g electron@39.2.7
chmod 4755 /usr/local/lib/node_modules/electron/dist/chrome-sandbox

npm -g install electron-store@11.0.2

touch /.chrootend