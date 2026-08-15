{

updateDefaultInStorage("checkInternetEnable", true)
updateDefaultInStorage("checkInternetUrl", "https://google.com")
updateDefaultInStorage("checkInternetPeriodTimer", 10000)
updateDefaultInStorage("checkInternetTimeout", 3000)

function test() {
    if (storage.url.startsWith("file:")) {
        setWebviewShowState(true)
    } else {
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
                
            }
    
            setWebviewShowState(nowHas)
        }
    
        setInterval(updateInternetStatus, checkPeriod)
        updateInternetStatus()
    }
}

window.updateLoadingProcess = function() {
    if (storage.checkInternetEnable) {
        
    } else {
        setWebviewShowState(true)
    }
}

}