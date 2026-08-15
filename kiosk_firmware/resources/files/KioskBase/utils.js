const path = require('path')
const fs = require('fs')
const { app } = require('electron')
const { exec, execSync } = require('child_process')
const { pathToFileURL } = require('url')

const globalNodeModules = execSync('npm root -g').toString().trim()
const startTime = Date.now()

const deasync = globalRequire('deasync')

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

function syncGlobalImport(moduleName) {
    const modulePath = path.join(globalNodeModules, moduleName);
    const pkgPath = path.join(modulePath, 'package.json');
    const mainFile = getPackageMainFile(pkgPath)

    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.exports) {
            const exp = pkg.exports['.'] || pkg.exports;
            if (typeof exp === 'string') mainFile = exp;
            else if (typeof exp === 'object' && exp.import) mainFile = exp.import;
            else mainFile = exp?.default || 'index.js';
        } else if (pkg.main) {
            mainFile = pkg.main;
        }
    } catch (_) {}

    const fullPath = path.join(modulePath, mainFile);
    const url = pathToFileURL(fullPath).href;

    return new Proxy({}, {
        get(target, prop) {
            return function(...args) {
                const argsStr = args.map(arg => {
                    if (typeof arg === 'string') return `'${arg.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
                    if (typeof arg === 'number' || typeof arg === 'boolean' || arg === null) return String(arg);
                    if (arg === undefined) return 'undefined';
                    return JSON.stringify(arg);
                }).join(', ');

                const script = `
                    import('${url}').then(mod => {
                        if (typeof mod.${prop} !== 'function') {
                            console.error('Method ${prop} not function');
                            process.exit(1);
                        }
                        const result = mod.${prop}(${argsStr});
                        console.log(JSON.stringify(result));
                    }).catch(err => {
                        console.error(err);
                        process.exit(1);
                    });
                `;

                try {
                    const output = execSync(`node --input-type=module -e "${script}"`, {
                        encoding: 'utf8',
                        stdio: ['pipe', 'pipe', 'pipe']
                    });
                    return JSON.parse(output.trim());
                } catch (error) {
                    throw new Error(`Call error ${moduleName}.${prop}: ${error.stderr || error.message}`);
                }
            };
        }
    });
}

const change_case = syncGlobalImport('change-case')
console.log(change_case)

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
