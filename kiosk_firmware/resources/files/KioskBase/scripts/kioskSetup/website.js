(function() {

const tab = tab_create()

function updateValue() {
    reloadKiosk()
}

tab_createInput(tab, "url", updateValue)
tab_createInput(tab, "sessionTimeoutEnabled", updateValue)
tab_createInput(tab, "sessionTimeout", updateValue, 10, 60 * 60 * 24)
tab_createInput(tab, "sessionTemp", updateValue)
tab_createInput(tab, "startTimerOnInteraction", updateValue)
tab_createInput(tab, "rootAccessForTheWebsite", updateValue)

addKioskSetupTab("Website", tab)

})();