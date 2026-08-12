{

const { ipcRenderer } = require('electron')

function kioskSetup() {
    console.log("open kiosk setup")
}

ipcRenderer.on('open-kiosk-setup', (event, data) => {
    kioskSetup()
});

setTimeout(() => {
    kioskFirstRun()
}, 100)

}