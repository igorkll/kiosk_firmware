{

updateDefaultInStorage("checkInternetEnable", true)
updateDefaultInStorage("checkInternetUrl", "https://google.com")
updateDefaultInStorage("checkInternetPeriodTimer", 10000)
updateDefaultInStorage("checkInternetTimeout", 3000)

let hasInternet = false
    
async function checkInternet() {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), checkTimeout)
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
    const nowHas = await checkInternet()

    if (nowHas !== hasInternet) {
        hasInternet = nowHas
        if (hasInternet) {
        } else {
            recreateWebview()
        }
    }

    setWebviewShowState(nowHas)
}

function checkInternet() {
    if (storage.url.startsWith("file:")) {
        setWebviewShowState(true)
    } else {
        setInterval(updateInternetStatus, checkPeriod)
        updateInternetStatus()
    }
}

window.updateLoadingProcess = function() {
    if (storage.checkInternetEnable) {
        checkInternet()
    } else {
        setWebviewShowState(true)
    }
}

}