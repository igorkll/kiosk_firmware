{

const tab = createTab()

function updateValue() {
    updateLoadingProcess()
}

tab_createInput(tab, "checkInternetEnable", updateValue)
tab_createInput(tab, "checkInternetUrl", updateValue)
tab_createInput(tab, "checkInternetPeriodTimer", updateValue)
tab_createInput(tab, "checkInternetTimeout", updateValue)

addKioskSetupTab("Check internet", tab)

}