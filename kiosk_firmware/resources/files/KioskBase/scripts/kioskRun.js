{

const default_url = "https://google.com"

const Store = globalRequire("electron-store")
const store = new Store()

let webview = null

// ----------------------------------------------

function updateDefaultInStore(key, value) {
    if (!store.has(key)) {
        store.set(key, value)
    }
}

updateDefaultInStore("url", default_url)
updateDefaultInStore("sessionTemp", false)
updateDefaultInStore("sessionTimeout", 20000)
updateDefaultInStore("startSessionTimerOnlyAfterFirstUserInteract", false)

// ----------------------------------------------

let sessionTimeoutId = null
let sessionTimeoutUrl = null
let sessionTimeoutSessionTemp = null
let sessionTimeoutCurrent = null

function recreateWebview(newPartition) {
    if (webview != null) {
        webview.remove()
    }

    const newWebview = document.createElement('webview')
    newWebview.classList.add("webview")
    newWebview.partition = newPartition

    document.body.appendChild(newWebview)
    webview = newWebview
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
    if (sessionTimeoutCurrent > 0) {
        sessionTimeoutId = setTimeout(() => {
            console.log("session timeout! restart kiosk")
            kioskRun(sessionTimeoutUrl, sessionTimeoutSessionTemp, sessionTimeoutCurrent)
        }, sessionTimeoutCurrent)
    }
}

window.sessionTimeoutReset = function () {
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

window.kioskFirstRun = function() {
    kioskRun(
        store.get("url"),
        store.get("sessionTemp"),
        store.get("sessionTimeout"),
        store.get("startSessionTimerOnlyAfterFirstUserInteract")
    )
}

}