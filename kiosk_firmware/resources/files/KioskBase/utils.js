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

async function globalImport(moduleName) {
    // 1. Определяем путь к модулю
    const modulePath = path.join(globalNodeModules, moduleName);
    // 2. Пытаемся найти основной файл через require.resolve (если модуль поддерживает CommonJS)
    //    Но для ESM лучше сначала проверить package.json
    const pkgPath = path.join(modulePath, 'package.json');
    let mainFile = 'index.js'; // по умолчанию
    try {
        const pkg = require(pkgPath); // читаем package.json (синхронно, но можно и fs.readFile)
        if (pkg.exports) {
            // Если есть exports, используем первый экспорт (например, "." -> "./index.js")
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
        // Если package.json нет, используем index.js
    }
    const fullPath = path.join(modulePath, mainFile);
    // 3. Преобразуем путь в URL (для Windows нужно добавить префикс file://)
    const url = pathToFileURL(fullPath).href;
    // 4. Динамический импорт
    const mod = await import(url);
    return mod;
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
