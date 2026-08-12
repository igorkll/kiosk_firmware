{

const default_url = "https://google.com"

const Store = globalRequire("electron-store")
const store = new Store();

const webview = document.getElementById("webview")

window.kioskRun = function (url, sessionTemp, sessionTimeout) {
    webview
}

kioskRun(
    store.get("url", default_url),
    store.get("sessionTemp", false),
    store.get("sessionTimeout", 0)
)

}