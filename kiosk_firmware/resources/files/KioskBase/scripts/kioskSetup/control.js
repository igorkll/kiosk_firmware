(function() {

const tab = tab_create()
//tab.style.alignItems = "center"

tab_createButton(tab, "Shutdown", power_shutdown)
tab_createButton(tab, "Reboot", power_reboot)
tab_createButton(tab, "Debug terminal", power_openTerminalAsync)

addKioskSetupTab("Control", tab)

})();