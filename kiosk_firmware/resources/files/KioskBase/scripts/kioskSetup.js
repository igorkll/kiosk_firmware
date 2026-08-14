{

const { ipcRenderer } = require('electron')

const overlay = document.getElementById("overlay")

function openKioskSetup() {
    console.log("open kiosk setup")
    overlay.classList.add("overlay-open")
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add("overlay-open2")
        })
    })
}

function closeKioskSetup() {
    console.log("close kiosk setup")
    overlay.classList.remove("overlay-open2")
    setTimeout(() => {
        overlay.classList.remove("overlay-open")
    }, 1000)
}

function toggleKioskSetup() {
    if (overlay.classList.contains("overlay-open")) {
        closeKioskSetup()
    } else {
        openKioskSetup()
    }
}

ipcRenderer.on('open-kiosk-setup', (event, data) => {
    toggleKioskSetup()
})

setTimeout(() => {
    kioskFirstRun()
}, 100)

document.getElementById("overlay-close-btn").addEventListener("click", closeKioskSetup)

}