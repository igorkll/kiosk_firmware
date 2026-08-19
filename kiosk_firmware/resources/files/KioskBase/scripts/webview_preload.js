const { contextBridge, ipcRenderer } = require('electron')

const api = {
    user_interaction: () => ipcRenderer.sendToHost('user_interaction')
}

if (process.contextIsolated) {
    contextBridge.exposeInMainWorld('kiosk_firmware_internals', api)
} else {
    window.kiosk_firmware_internals = api
}
