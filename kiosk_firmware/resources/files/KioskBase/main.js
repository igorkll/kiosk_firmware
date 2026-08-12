let debug = true
let debug_force = false

const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const path = require('path')
const fs = require('fs')

if (fs.existsSync("/.kiosk_firmware")) {
    debug = debug_force
}

eval(fs.readFileSync(path.join(__dirname, 'utils.js'), 'utf8'))

const Store = globalRequire('electron-store')
Store.initRenderer()

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
            webContents.on('before-input-event', beforeInputEvent);
        });

        win.webContents.on('before-input-event', beforeInputEvent);
    }

    win.once('ready-to-show', () => {
        win.show()
    })

    globalShortcut.register('CommandOrControl+Meta+Shift+S+O', () => {
        win.webContents.send("open-kiosk-setup")
    });

    win.loadFile(path.join(__dirname, 'main.html'))

    if (debug) win.openDevTools()
}

ipcMain.on('quit-app', () => {
    app.quit()
})

app.whenReady().then(createWindow)