{

const default_url = "https://google.com"

const Store = globalRequire("electron-store")
const store = new Store()

const webview = document.getElementById("webview")

// ----------------------------------------------

let sessionTimeoutId = null
let sessionTimeoutUrl = null
let sessionTimeoutSessionTemp = null
let sessionTimeoutCurrent = null

function changeWebviewPartition(newPartition) {
    const parent = webview.parentNode
    webview.remove()

    const newWebview = document.createElement('webview')
    newWebview.partition = newPartition

    parent.appendChild(newWebview)

    webview = newWebview
}

function rawRunKiosk(url, sessionTemp) {
    let partition
    if (sessionTemp) {
        partition = 'persist:kiosk'
    } else {
        partition = `temp-${Date.now()}-${Math.random()}`
    }

    changeWebviewPartition(partition)
    webview.src = url
}

function stopSessionTimer() {
    if (sessionTimeoutId != null) {
        clearTimeout(sessionTimeoutId)
    }
}

function runSessionTimer() {
    if (sessionTimeoutCurrent > 0) {
        sessionTimeoutId = setTimeout(() => {
            console.log("session timeout! restart kiosk")
            kioskRun(sessionTimeoutUrl, sessionTimeoutSessionTemp, sessionTimeoutCurrent)
        }, sessionTimeoutCurrent)
    }
}

function sessionTimeoutReset() {
    console.log("session timeout reset")
    stopSessionTimer()
    runSessionTimer()
}

window.kioskRun = function (url, sessionTemp, sessionTimeout, startSessionTimerOnlyAfterFirstUserInteract) {
    console.log(`run kiosk ${url} ${sessionTemp} ${sessionTimeout} ${startSessionTimerOnlyAfterFirstUserInteract}`)
    rawRunKiosk(url, sessionTemp)

    stopSessionTimer()
    sessionTimeoutUrl = url
    sessionTimeoutSessionTemp = sessionTemp
    sessionTimeoutCurrent = sessionTimeout
    if (!startSessionTimerOnlyAfterFirstUserInteract) {
        runSessionTimer()
    }
}

kioskRun(
    store.get("url", default_url),
    store.get("sessionTemp", false),
    store.get("sessionTimeout", 5000),
    store.get("startSessionTimerOnlyAfterFirstUserInteract", false)
)

}