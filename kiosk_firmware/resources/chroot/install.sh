#!/bin/bash
set -e

npm install -g electron@39.2.7
npm install -g  electron-store@8

chmod 4755 /usr/local/lib/node_modules/electron/dist/chrome-sandbox

touch /.chrootend