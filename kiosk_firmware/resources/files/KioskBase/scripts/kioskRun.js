{

function updateDefaultInStore(key, value) {
    if (!store.has(key)) {
        store.set(key, value)
    }
}

updateDefaultInStore("url", "https://google.com")
updateDefaultInStore("sessionTemp", false)
updateDefaultInStore("sessionTimeout", 20000)
updateDefaultInStore("startTimerOnInteraction", true)

// ----------------------------------------------

let webview = null
let sessionTimeoutId = null
let sessionTimeoutUrl = null
let sessionTimeoutSessionTemp = null
let sessionTimeoutCurrent = null
let sessionTimeoutStartTimerOnInteraction = null

const user_interaction_code = fs.readFileSync(path.join(__dirname, "scripts", "user_interaction_check.js"), "utf8")

function recreateWebview(newPartition) {
    if (webview != null) {
        webview.remove()
    }

    const newWebview = document.createElement('webview')
    newWebview.classList.add("webview")
    newWebview.partition = newPartition
    newWebview.preload="scripts/webview_preload.js"

    newWebview.addEventListener('dom-ready', () => {
        console.log(user_interaction_code)
        webview.executeJavaScript("codeInWebview = true\n" + user_interaction_code)
        webview.openDevTools()
    });

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
            kioskRun(sessionTimeoutUrl, sessionTimeoutSessionTemp, sessionTimeoutCurrent, sessionTimeoutStartTimerOnInteraction)
        }, sessionTimeoutCurrent)
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

window.kioskFirstRun = function() {
    kioskRun(
        store.get("url"),
        store.get("sessionTemp"),
        store.get("sessionTimeout"),
        store.get("startTimerOnInteraction")
    )

    document.addEventListener("user_interaction", sessionTimeoutReset)
    ipcMain.on('user_interaction', sessionTimeoutReset)
}

}