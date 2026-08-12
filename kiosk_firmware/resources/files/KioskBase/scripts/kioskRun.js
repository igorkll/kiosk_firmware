{

const default_url = "https://google.com"

const Store = globalRequire("electron-store")
const store = new Store();

const webview = document.getElementById("webview")

window.kioskRun = function (url, sessionTemp, sessionTimeout) {
    if (sessionTemp) {
        webview.partition = 'persist:kiosk'
    } else {
        webview.partition = `temp-${Date.now()}-${Math.random()}`
    }

    webview.loadURL(url, { replace: true })
}

kioskRun(
    store.get("url", default_url),
    store.get("sessionTemp", false),
    store.get("sessionTimeout", 0)
)

}