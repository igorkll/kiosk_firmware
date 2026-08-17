const path = require('path')
const fs = require('fs')
const { app } = require('electron')
const { exec, execSync } = require('child_process')
const { pathToFileURL } = require('url')

const globalNodeModules = execSync('npm root -g').toString().trim()
const startTime = Date.now()

const Store = globalRequire("electron-store")
const storage = new Store()

function updateDefaultInStorage(key, value) {
    if (!storage.has(key)) {
        storage.set(key, value)
    }
}

codeInWebview = false

function getUptimeMs() {
    return Date.now() - startTime
}

function globalRequire(name) {
    return require(path.join(globalNodeModules, name))
}

function getPackageMainFile(pkgPath) {
    let mainFile = 'index.js';
    try {
        const pkg = require(pkgPath)
        if (pkg.exports) {
            const exp = pkg.exports['.'] || pkg.exports;
            if (typeof exp === 'string') {
                mainFile = exp;
            } else if (typeof exp === 'object' && exp.import) {
                mainFile = exp.import;
            } else {
                mainFile = exp?.default || 'index.js';
            }
        } else if (pkg.main) {
            mainFile = pkg.main;
        }
    } catch (e) {
    }
    return mainFile
}

async function globalImport(moduleName) {
    const modulePath = path.join(globalNodeModules, moduleName);
    const pkgPath = path.join(modulePath, 'package.json');
    const mainFile = getPackageMainFile(pkgPath)

    const fullPath = path.join(modulePath, mainFile)
    const url = pathToFileURL(fullPath).href;
    return await import(url)
}

function mergeTables(tbl, def) {
    for (let key in def) {
        if (!(key in tbl)) {
            tbl[key] = def[key]
        } else if (typeof def[key] === 'object' && def[key] != null && !Array.isArray(def[key])) {
            mergeTables[tbl[key], def[key]]
        }
    }
}

function keyHoldTrigger(callback, triggerActiveTime=5000, triggerResetTime=150) {
    let lastTriggerTimeMs = null
    let lastTriggerResetedTimeMs = null

    return () => {
        let currentTime = getUptimeMs()

        if (lastTriggerResetedTimeMs == null || currentTime - lastTriggerTimeMs > triggerResetTime) {
            lastTriggerResetedTimeMs = currentTime
        }

        if (currentTime - lastTriggerResetedTimeMs > triggerActiveTime) {
            callback()
            lastTriggerResetedTimeMs = null
        }

        lastTriggerTimeMs = currentTime
    }
}

function insertAt(parent, newElement, index) {
    const reference = parent.children[index] || null;
    parent.insertBefore(newElement, reference);
}

function capitalCase(str) {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-\s]+/g, ' ')
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ');
}
