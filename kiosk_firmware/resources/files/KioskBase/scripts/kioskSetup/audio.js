(function() {

const tab = tab_create()

tab_createSlider(tab, "outputVolume", () => {
    updateVolume()
})

tab_createSlider(tab, "inputVolume", () => {
    updateVolume()
})

addKioskSetupTab("Audio", tab)

})();