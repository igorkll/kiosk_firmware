(function() {

const tab = tab_create()
tab.style.alignItems = "center";

tab_createButton(tab, "Shutdown", () => {
    exec('/sbin/shutdown', (error, stdout, stderr) => {});
})

tab_createButton(tab, "Reboot", () => {
    exec('/sbin/reboot', (error, stdout, stderr) => {});
})

tab_createButton(tab, "Debug terminal", () => {
    exec('weston-terminal', (error, stdout, stderr) => {});
})

addKioskSetupTab("Control", tab)

})();