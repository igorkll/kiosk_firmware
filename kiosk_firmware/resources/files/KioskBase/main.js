let debug = true
let debug_force = false

const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const tunnelPath = '/tmp/kiosk_tunnel'

if (fs.existsSync("/.kiosk_firmware")) {
    debug = debug_force
}

const globalNodeModules = execSync('npm root -g').toString().trim()

function globalRequire(name) {
    return require(path.join(globalNodeModules, name))
}

const Store = globalRequire('electron-store')

function createWindow () {
    const win = new BrowserWindow({
        frame: debug,
        fullscreen: !debug,
        width: 1280,
        height: 720,
        show: false,
        webPreferences: {
            devTools: debug, // DON'T FORGET TO TURN OFF THE DAMN DEVTOOLS!
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true
        }
    })

    if (!debug) {
        let beforeInputEvent = (event, input) => {
            let isBlocked = false

            if (input.code === 'F5' || input.code === 'F11' || input.code === 'F12') {
                isBlocked = true
            }

            const ctrlOrCmd = input.control || input.meta
            if (ctrlOrCmd) {
                isBlocked = input.code === 'KeyR' ||
                    input.code === 'KeyW' ||
                    input.code === 'KeyQ' ||
                    input.code === 'KeyM'
            }

            if (isBlocked) {
                event.preventDefault()
            }
        }

        win.webContents.on('did-attach-webview', (event, webContents) => {
            webContents.on('before-input-event', beforeInputEvent)
        })

        win.webContents.on('before-input-event', beforeInputEvent)
    }

    win.once('ready-to-show', () => {
        win.show()
    })

    if (fs.existsSync(tunnelPath)) {
        fs.watch(tunnelPath, (eventType, filename) => {
            if (eventType === 'change') {
                let content = fs.readFileSync(tunnelPath, "utf8").trim()
                console.log("kiosk tunnel: ", content)
                switch (content) {
                    case "setup":
                        win.webContents.send("open-kiosk-setup")
                        break
                }
            }
        })
    }

    globalShortcut.register('CommandOrControl+Meta+Shift+S', () => {
        win.webContents.send("open-kiosk-setup-trigger")
    })

    globalShortcut.register('CommandOrControl+Alt+Delete', () => {
        win.webContents.send("open-kiosk-setup")
    })

    win.loadFile(path.join(__dirname, 'main.html'))

    if (debug) win.openDevTools()

    return win
}

ipcMain.on('quit-app', () => {
    app.quit()
})

let win = null

ipcMain.on('open-devtools', () => {
    if (win != null) win.openDevTools()
})

app.whenReady().then(() => {
    Store.initRenderer()
    win = createWindow()
})
