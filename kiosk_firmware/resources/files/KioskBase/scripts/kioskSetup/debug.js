(function() {

const tab = tab_create()
tab.style.alignItems = "center"

tab_createButton(tab, "Debug terminal", system_openTerminalAsync)
tab_createButton(tab, "Open website devtools", () => {
    openDevTools()
})
tab_createButton(tab, "Open system devtools", () => {
    ipcRenderer.send('open-devtools')
})

addKioskSetupTab("Debug", tab)

})();