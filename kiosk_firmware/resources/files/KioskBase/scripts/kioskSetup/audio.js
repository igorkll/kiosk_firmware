(function() {

const tab = tab_create()

const setOutputVolumeReduced = reduceNumberOfCalls(setOutputVolume)
const setInputVolumeReduced = reduceNumberOfCalls(setInputVolume)

tab_createSlider(tab, "outputVolume", (released) => {
    console.log("T")
    if (released) {
        updateVolume()
    } else {
        updateVolumeReduced()
    }
})

tab_createSlider(tab, "inputVolume", (released) => {
    console.log("T")
    if (released) {
        updateVolume()
    } else {
        updateVolumeReduced()
    }
})

addKioskSetupTab("Audio", tab)

})();