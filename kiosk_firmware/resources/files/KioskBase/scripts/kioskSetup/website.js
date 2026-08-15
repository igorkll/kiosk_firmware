{

const tab = createTab()

function updateValue() {
    reloadKiosk()
}

tab_createInput(tab, "url", updateValue)
tab_createInput(tab, "sessionTemp", updateValue)
tab_createInput(tab, "sessionTimeout", updateValue)
tab_createInput(tab, "startTimerOnInteraction", updateValue)

addKioskSetupTab("Website", tab)

}