(function() {

const tab = tab_create()

const updateVolumeReduced = reduceNumberOfCalls(updateVolume)

function volumeSliderHandle(released) {
    if (released) {
        updateVolume()
    } else {
        updateVolumeReduced()
    }
}

tab_createSlider(tab, "outputVolume", (released) => {
    volumeSliderHandle(released)
})

tab_createSlider(tab, "inputVolume", (released) => {
    volumeSliderHandle(released)
})

addKioskSetupTab("Audio", tab)

})();