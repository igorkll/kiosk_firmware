const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('ipcRenderer', {
    user_interaction: () => ipcRenderer.sendToHost('user_interaction')
})
