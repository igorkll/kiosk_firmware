function syncGlobalImport(moduleName) {
    const modulePath = path.join(globalNodeModules, moduleName)
    const pkgPath = path.join(modulePath, 'package.json')
    const mainFile = getPackageMainFile(pkgPath)

    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
        if (pkg.exports) {
            const exp = pkg.exports['.'] || pkg.exports
            if (typeof exp === 'string') mainFile = exp
            else if (typeof exp === 'object' && exp.import) mainFile = exp.import
            else mainFile = exp?.default || 'index.js'
        } else if (pkg.main) {
            mainFile = pkg.main
        }
    } catch (_) {}

    const fullPath = path.join(modulePath, mainFile)
    const url = pathToFileURL(fullPath).href

    return new Proxy({}, {
        get(target, prop) {
            return function(...args) {
                const argsStr = args.map(arg => {
                    if (typeof arg === 'string') return `'${arg.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
                    if (typeof arg === 'number' || typeof arg === 'boolean' || arg === null) return String(arg)
                    if (arg === undefined) return 'undefined'
                    return JSON.stringify(arg)
                }).join(', ')

                const script = `
                    import('${url}').then(mod => {
                        if (typeof mod.${prop} !== 'function') {
                            console.error('Method ${prop} not function')
                            process.exit(1)
                        }
                        const result = mod.${prop}(${argsStr})
                        console.log(JSON.stringify(result))
                    }).catch(err => {
                        console.error(err)
                        process.exit(1)
                    })
                `

                try {
                    const output = execSync(`node --input-type=module -e "${script}"`, {
                        encoding: 'utf8',
                        stdio: ['pipe', 'pipe', 'pipe']
                    })
                    return JSON.parse(output.trim())
                } catch (error) {
                    throw new Error(`Call error ${moduleName}.${prop}: ${error.stderr || error.message}`)
                }
            }
        }
    })
}

const change_case = syncGlobalImport('change-case')
