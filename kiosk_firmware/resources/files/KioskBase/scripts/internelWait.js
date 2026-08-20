(function() {

updateDefaultInStorage("checkInternetEnable", true)
updateDefaultInStorage("checkInternetShowProcess", true)
updateDefaultInStorage("checkInternetShowFirstProcess", false)
updateDefaultInStorage("checkInternetUrl", "https://google.com")
updateDefaultInStorage("checkInternetPeriodTimer", 10)
updateDefaultInStorage("checkInternetTimeout", 3)

let hasInternet = null
let updateInternetStatusIntervalId = null
let currentWaitId = 0
   
async function checkInternet() {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), storage.get("checkInternetTimeout") * 1000)
        const response = await fetch(storage.get("checkInternetUrl"), {
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

async function updateInternetStatus(waitId) {
    console.log("checking internet...")
    const nowHas = await checkInternet()
    console.log("internet state", nowHas)

    if (waitId !== currentWaitId) {
        console.log("changed wait id")
        return
    }

    if (nowHas !== hasInternet) {
        hasInternet = nowHas
        setKioskState(hasInternet)
    }
}

window.updateLoadingProcess = function() {
    if (updateInternetStatusIntervalId != null) {
        clearInterval(updateInternetStatusIntervalId)
        updateInternetStatusIntervalId = null
    }

    hasInternet = null

    if (storage.get("checkInternetEnable")) {
        if (storage.get("url").startsWith("file:")) {
            currentWaitId++
            console.log("show webview for file")
            setKioskState(true)
        } else {
            console.log("check internet enable. start interval")
            updateInternetStatusIntervalId = setInterval(() => {
                updateInternetStatusIntervalId = null
                updateInternetStatus(++currentWaitId)
            }, storage.get("checkInternetPeriodTimer") * 1000)
            updateInternetStatus(++currentWaitId)
        }
    } else {
        currentWaitId++
        console.log("check internet disabled")
        setKioskState(true)
    }
}

})();