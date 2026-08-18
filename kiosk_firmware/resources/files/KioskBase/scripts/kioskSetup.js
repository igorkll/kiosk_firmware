(function() {

const { ipcRenderer } = require('electron')

const overlay = document.getElementById("overlay")

let closeKioskTimer = null
function openKioskSetup() {
    console.log("open kiosk setup")

    if (closeKioskTimer != null) {
        clearTimeout(closeKioskTimer)
        closeKioskTimer = null
    }

    overlay.classList.add("overlay-open")
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add("overlay-open")
            overlay.classList.add("overlay-open2")
        })
    })
}

function closeKioskSetup() {
    console.log("close kiosk setup")
    overlay.classList.remove("overlay-open2")
    if (closeKioskTimer != null) {
        closeKioskTimer = setTimeout(() => {
            closeKioskTimer = null
            overlay.classList.remove("overlay-open")
            overlay.classList.remove("overlay-open2")
        }, 1000)
    }
}

function toggleKioskSetup() {
    if (overlay.classList.contains("overlay-open2")) {
        closeKioskSetup()
    } else {
        openKioskSetup()
    }
}

ipcRenderer.on('open-kiosk-setup', toggleKioskSetup)

const keyHoldTriggerCallback = keyHoldTrigger(toggleKioskSetup)
ipcRenderer.on('open-kiosk-setup-trigger', () => {
    console.log("open-kiosk-setup trigger")
    keyHoldTriggerCallback()
})

setTimeout(() => {
    kioskFirstRun()
}, 100)

document.getElementById("overlay-close-btn").addEventListener("click", closeKioskSetup)

})();