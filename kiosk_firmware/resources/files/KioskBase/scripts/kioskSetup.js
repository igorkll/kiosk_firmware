{

const { ipcRenderer } = require('electron')

const overlay = document.getElementById("overlay")
const overlay_buttons = document.getElementById("overlay-buttons")
const overlay_tabs = document.getElementById("overlay-tabs")

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

let allTabs = []
window.addKioskSetupTab = function(name, tab) {
    let button = document.createElement("button")
    button.classList.add("tab-button")
    button.textContent = name
    overlay_buttons.appendChild(button)

    tab.style.display = 'none'
    overlay_tabs.appendChild(tab)
    allTabs.push(tab)
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

}