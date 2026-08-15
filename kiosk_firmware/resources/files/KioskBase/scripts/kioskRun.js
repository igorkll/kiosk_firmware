{

updateDefaultInStorage("url", "https://google.com")
updateDefaultInStorage("sessionTemp", false)
updateDefaultInStorage("sessionTimeout", 20000)
updateDefaultInStorage("startTimerOnInteraction", true)

// ----------------------------------------------

let webview = null
let sessionTimeoutId = null
let sessionTimeoutUrl = null
let sessionTimeoutSessionTemp = null
let sessionTimeoutCurrent = null
let sessionTimeoutStartTimerOnInteraction = null

const user_interaction_code = fs.readFileSync(path.join(__dirname, "scripts", "user_interaction_check.js"), "utf8")

window.setWebviewShowState = function(state) {
    webview.style.display = state ? "" : "none"
    document.body.style.cursor = state ? "" : "none"
    loading_process.style.display = state ? "none" : "flex"
}

window.recreateWebview = function(newPartition=null) {
    if (newPartition == null) newPartition = webview.partition
    if (webview != null) webview.remove()

    const newWebview = document.createElement('webview')
    newWebview.classList.add("webview")
    newWebview.partition = newPartition
    newWebview.preload="scripts/webview_preload.js"

    newWebview.addEventListener('ipc-message', (event) => {
        if (event.channel === 'user_interaction') {
            document.dispatchEvent(new CustomEvent('user_interaction'))
        }
    })

    newWebview.addEventListener('dom-ready', () => {
        webview.executeJavaScript("codeInWebview = true\n" + user_interaction_code)
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

window.kioskAutoRun = function() {
    kioskRun(
        storage.get("url"),
        storage.get("sessionTemp"),
        storage.get("sessionTimeout"),
        storage.get("startTimerOnInteraction")
    )
}

window.kioskFirstRun = function() {
    kioskAutoRun()
    document.addEventListener("user_interaction", sessionTimeoutReset)
}

}