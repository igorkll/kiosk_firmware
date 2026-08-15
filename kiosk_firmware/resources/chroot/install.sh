#!/bin/bash
set -e

npm install -g electron@40.6.1
npm install -g electron-store@8
npm install -g change-case@5.4.4
npm install -g deasync@0.1.31

chmod 4755 /usr/local/lib/node_modules/electron/dist/chrome-sandbox

touch /.chrootend