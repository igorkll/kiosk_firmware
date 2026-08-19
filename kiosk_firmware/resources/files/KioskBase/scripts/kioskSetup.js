(function() {

const { ipcRenderer } = require('electron')

const overlay = document.getElementById("overlay")
const loading_process = document.getElementById("loading-process")

const autoCloseMenuTimer = 10

let closeKioskTimer = null
let autoCloseKioskSetupTimerId = null

function startAutoCloseTimer() {
    autoCloseKioskSetupTimerId = setTimeout(closeKioskSetup, autoCloseMenuTimer * 1000)
}

function openKioskSetup() {
    console.log("open kiosk setup")
    loading_process.style.cursor = "default"

    if (closeKioskTimer != null) {
        clearTimeout(closeKioskTimer)
        closeKioskTimer = null
    }

    if (autoCloseKioskSetupTimerId != null) clearTimeout(autoCloseKioskSetupTimerId)
    startAutoCloseTimer()

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
    loading_process.style.cursor = "none"

    if (autoCloseKioskSetupTimerId != null) {
        clearTimeout(autoCloseKioskSetupTimerId)
        autoCloseKioskSetupTimerId = null
    }

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

function resetAutoCloseTimer() {
    if (autoCloseKioskSetupTimerId != null) {
        console.log("reset auto close kiosk setup timer")
        clearTimeout(autoCloseKioskSetupTimerId)
        startAutoCloseTimer()
    }
}

document.addEventListener("user_interaction", resetAutoCloseTimer)

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