(function() {

updateDefaultInStorage("url", "https://google.com")
updateDefaultInStorage("sessionTimeoutEnabled", false)
updateDefaultInStorage("sessionTemp", false)
updateDefaultInStorage("sessionTimeout", 60)
updateDefaultInStorage("startTimerOnInteraction", true)
updateDefaultInStorage("rootAccessForTheWebsite", false)

// ----------------------------------------------

let webview = null
let sessionTimeoutId = null
let sessionTimeoutUrl = null
let sessionTimeoutSessionTemp = null
let sessionTimeoutCurrent = null
let sessionTimeoutStartTimerOnInteraction = null

const user_interaction_code = fs.readFileSync(path.join(__dirname, "scripts", "user_interaction_check.js"), "utf8")

const loading_process = document.getElementById("loading-process")

let webviewShowState = false
let kioskState = false

window.setWebviewShowState = function(state) {
    console.log("setWebviewShowState", state)
    webviewShowState = state
    if (webview != null) webview.style.display = state ? "flex" : "none"
    document.body.style.cursor = state ? "" : "none"
    loading_process.style.display = state ? "none" : "flex"
}

window.setKioskState = function(state) {
    console.log("setKioskState", state)
    kioskState = state
    if (state) {
        kioskAutoRun()
        setWebviewShowState(true)
    } else {
        setWebviewShowState(false)
        kioskStop()
    }
}

window.reloadKiosk = function() {
    kioskStop()
    if (kioskState) kioskAutoRun()
}

window.recreateWebview = function(newPartition=null) {
    if (newPartition == null) newPartition = webview.partition
    if (webview != null) webview.remove()

    const newWebview = document.createElement('webview')
    newWebview.classList.add("webview")
    newWebview.partition = newPartition
    newWebview.preload="scripts/webview_preload.js"
    newWebview.style.display = webviewShowState ? "flex" : "none"

    let rootAccessForTheWebsite = storage.get("rootAccessForTheWebsite", false)
    if (rootAccessForTheWebsite) {
        newWebview.setAttribute("nodeintegration", "")
        newWebview.setAttribute("webpreferences", "contextIsolation=no")
    }

    newWebview.addEventListener('ipc-message', (event) => {
        if (event.channel === 'user_interaction') {
            document.dispatchEvent(new CustomEvent('user_interaction'))
        }
    })

    newWebview.addEventListener('dom-ready', () => {
        //newWebview.openDevTools()
        webview.executeJavaScript("codeInWebview = true;\n" + user_interaction_code)
    })

    document.body.appendChild(newWebview)
    webview = newWebview
}

window.removeWebview = function() {
    if (webview != null) webview.remove()
}

window.openDevTools = function() {
    if (webview != null) webview.openDevTools()
}

function rawRunKiosk(url=null, sessionTemp=false) {
    let partition
    if (sessionTemp) {
        partition = `temp-${Date.now()}-${Math.random()}`
    } else {
        partition = 'persist:kiosk'
    }

    recreateWebview(partition)
    if (url != null) {
        webview.src = url
    }
}

function stopSessionTimer() {
    if (sessionTimeoutId != null) {
        clearTimeout(sessionTimeoutId)
    }
}

function runSessionTimer() {
    if (sessionTimeoutCurrent > 0 && storage.get("sessionTimeoutEnabled", false)) {
        console.log("run session timer")
        sessionTimeoutId = setTimeout(() => {
            console.log("session timeout! restart kiosk")
            kioskRun(sessionTimeoutUrl, sessionTimeoutSessionTemp, sessionTimeoutCurrent, sessionTimeoutStartTimerOnInteraction)
        }, sessionTimeoutCurrent * 1000)
    }
}

window.sessionTimeoutReset = function () {
    console.log("session timeout reset")
    stopSessionTimer()
    runSessionTimer()
}

window.kioskRun = function (url, sessionTemp, sessionTimeout, startTimerOnInteraction) {
    console.log(`run kiosk ${url} ${sessionTemp} ${sessionTimeout} ${startTimerOnInteraction}`)
    rawRunKiosk(url, sessionTemp)

    stopSessionTimer()
    sessionTimeoutUrl = url
    sessionTimeoutSessionTemp = sessionTemp
    sessionTimeoutCurrent = sessionTimeout
    sessionTimeoutStartTimerOnInteraction = startTimerOnInteraction
    if (!startTimerOnInteraction) {
        runSessionTimer()
    }
}

window.kioskStop = function() {
    stopSessionTimer()
    removeWebview()
}

window.kioskAutoRun = function() {
    kioskRun(
        storage.get("url"),
        storage.get("sessionTemp"),
        storage.get("sessionTimeout"),
        storage.get("startTimerOnInteraction")
    )
}

window.kioskFirstRun = function() {
    document.addEventListener("user_interaction", sessionTimeoutReset)
    updateLoadingProcess()
}

})();