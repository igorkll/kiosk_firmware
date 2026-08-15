{

const loading_process = document.getElementById("loading-process")

function setLoadingProcessState(state) {
    loading_process.style.display = state ? "flex" : "none"
}

updateDefaultInStorage("checkInternetEnable", true)
updateDefaultInStorage("checkInternetUrl", "https://google.com")

}