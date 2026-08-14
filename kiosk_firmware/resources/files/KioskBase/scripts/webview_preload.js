const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('kiosk_firmware_internals', {
    user_interaction: () => ipcRenderer.sendToHost('user_interaction')
})
