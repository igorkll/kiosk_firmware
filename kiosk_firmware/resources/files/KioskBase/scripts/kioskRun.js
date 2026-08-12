{

const default_url = "https://google.com"

const Store = globalRequire("electron-store")
const store = new Store();

const webview = document.getElementById("webview")

// ----------------------------------------------

let sessionTimeoutId = null
let sessionTimeoutUrl = null
let sessionTimeoutSessionTemp = null
let sessionTimeoutCurrent = null

function rawRunKiosk(url, sessionTemp) {
    if (sessionTemp) {
        webview.partition = 'persist:kiosk'
    } else {
        webview.partition = `temp-${Date.now()}-${Math.random()}`
    }

    webview.loadURL(url, { replace: true })
}

function stopSessionTimer() {
    if (sessionTimeoutId != null) {
        clearTimeout(sessionTimeoutId)
    }
}

function runSessionTimer() {
    if (sessionTimeoutCurrent > 0) {
        sessionTimeoutId = setTimeout(() => {
            kioskRun(sessionTimeoutUrl, sessionTimeoutSessionTemp)
        }, sessionTimeoutCurrent)
    }
}

function sessionTimeoutReset() {
    stopSessionTimer()
    runSessionTimer()
}

window.kioskRun = function (url, sessionTemp, sessionTimeout) {
    rawRunKiosk(url, sessionTemp)

    stopSessionTimer()
    sessionTimeoutUrl = url
    sessionTimeoutSessionTemp = sessionTemp
    sessionTimeoutCurrent = sessionTimeout
    runSessionTimer()
}

kioskRun(
    store.get("url", default_url),
    store.get("sessionTemp", false),
    store.get("sessionTimeout", 0)
)

}