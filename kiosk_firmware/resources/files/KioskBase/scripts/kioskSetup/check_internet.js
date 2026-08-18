{

    const tab = tab_create()
    
    function updateValue() {
        updateLoadingProcess()
    }
    
    tab_createInput(tab, "checkInternetEnable", updateValue)
    tab_createInput(tab, "checkInternetUrl", updateValue)
    tab_createInput(tab, "checkInternetPeriodTimer", updateValue, 1, 60)
    tab_createInput(tab, "checkInternetTimeout", updateValue, 1, 30)
    
    addKioskSetupTab("Check internet", tab)
    
    }