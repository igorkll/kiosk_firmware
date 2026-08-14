{

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
    closeKioskTimer = setTimeout(() => {
        closeKioskTimer = null
        overlay.classList.remove("overlay-open")
        overlay.classList.remove("overlay-open2")
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

{
    const triggerResetTime = 150
    let lastTriggerTimeMs = null

    ipcRenderer.on('open-kiosk-setup-trigger', (event, data) => {
        let currentTime = getUptimeMs()

        lastTriggerTimeMs = currentTime
    })
}

setTimeout(() => {
    kioskFirstRun()
}, 100)

document.getElementById("overlay-close-btn").addEventListener("click", closeKioskSetup)

}