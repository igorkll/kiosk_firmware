{

const tab_website = createTab()

function updateValue() {
    kioskStop()
    kioskAutoRun()
}

tab_createInput(tab_website, "url", updateValue)
tab_createInput(tab_website, "sessionTemp", updateValue)
tab_createInput(tab_website, "sessionTimeout", updateValue)
tab_createInput(tab_website, "startTimerOnInteraction", updateValue)

addKioskSetupTab("Website", tab_website)

}