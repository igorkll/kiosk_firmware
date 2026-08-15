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

let allTabs = []
let oldActiveTabIndex = null

window.selectKioskSetupTab = function(index) {
    if (oldActiveTabIndex != null) {
        let oldTab = allTabs[oldActiveTabIndex]
        oldTab.style.display = "none"
        oldTab.active_button.classList.remove("tab-button-selected")
    }

    let tab = allTabs[index]
    tab.style.display = ""
    tab.active_button.classList.add("tab-button-selected")
}

let lastIndex = 0
window.addKioskSetupTab = function(name, tab) {
    let button = document.createElement("button")
    button.classList.add("tab-button")
    button.textContent = name
    
    const index = lastIndex
    lastIndex++

    insertAt(overlay_buttons, button, index)
    
    button.addEventListener("click", () => {
        selectKioskSetupTab(index)
    })

    tab.style.display = "none"
    tab.active_button = button
    overlay_tabs.appendChild(tab)
    allTabs.push(tab)

    if (allTabs.length == 1) {
        selectKioskSetupTab(0)
    }
}

window.createTab = function() {
    let tab = document.createElement("div")
    tab.classList.add("tab")
    return tab
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