{

const { ipcRenderer } = require('electron')

function kioskSetup() {
    console.log("open kiosk setup")
}

ipcRenderer.on('open-kiosk-setup', (event, data) => {
    console.log("open kiosk setup event")
    kioskSetup()
});

setTimeout(() => {
    kioskFirstRun()
}, 100)

}