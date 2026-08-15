{

updateDefaultInStorage("checkInternetEnable", true)
updateDefaultInStorage("checkInternetUrl", "https://google.com")
updateDefaultInStorage("checkInternetPeriodTimer", 10000)
updateDefaultInStorage("checkInternetTimeout", 3000)

let hasInternet = false
    
async function checkInternet() {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), storage.get("checkInternetTimeout"))
        const response = await fetch(checkUrl, {
            method: "HEAD",
            signal: controller.signal,
            mode: "no-cors"
        })
        clearTimeout(timeoutId)
        return true
    } catch {
        return false
    }
}

async function updateInternetStatus() {
    const nowHas = false

    if (nowHas !== hasInternet) {
        hasInternet = nowHas
        if (hasInternet) {
        } else {
            recreateWebview()
        }
    }

    setWebviewShowState(nowHas)
}

let updateInternetStatusIntervalId = null

window.updateLoadingProcess = function() {
    if (updateInternetStatusIntervalId != null) {
        clearInterval(updateInternetStatusIntervalId)
        updateInternetStatusIntervalId = null
    }

    if (storage.get("checkInternetEnable")) {
        if (storage.get("url").startsWith("file:")) {
            console.log("show webview for file")
            setWebviewShowState(true)
        } else {
            console.log("check internet enable. start interval")
            updateInternetStatusIntervalId = setInterval(updateInternetStatus, storage.get("checkInternetPeriodTimer"))
            updateInternetStatus()
        }
    } else {
        console.log("check internet disabled")
        setWebviewShowState(true)
    }
}

}