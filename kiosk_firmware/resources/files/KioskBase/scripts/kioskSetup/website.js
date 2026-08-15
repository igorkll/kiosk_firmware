{

const tab_website = createTab()

tab_createInput(tab_website, "url")
tab_createInput(tab_website, "sessionTemp")
tab_createInput(tab_website, "sessionTimeout")
tab_createInput(tab_website, "startTimerOnInteraction")

addKioskSetupTab("Website", tab_website)

}