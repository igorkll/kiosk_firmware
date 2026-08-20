(function() {

const tab = tab_create()

function updateValue() {
    updateLoadingProcess()
}

tab_createInput(tab, "checkInternetEnable", updateValue)
tab_createInput(tab, "checkInternetShowProcess", updateValue, null, null, "Show process")
tab_createInput(tab, "checkInternetShowProcess", updateValue, null, null, "Show first connect process")
tab_createInput(tab, "checkInternetUrl", updateValue, null, null, "Check url")
tab_createInput(tab, "checkInternetPeriodTimer", updateValue, 1, 60, "Check period timer")
tab_createInput(tab, "checkInternetTimeout", updateValue, 1, 30, "Check timeout")

addKioskSetupTab("Check Internet", tab)

})();