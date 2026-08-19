(function() {

const tab = tab_create()

const setOutputVolumeReduced = reduceNumberOfCalls(setOutputVolume)
const setInputVolumeReduced = reduceNumberOfCalls(setInputVolume)

const slider_outputVolume = createSlider(getOutputVolume())
slider_outputVolume.addEventListener("slide", detailWrap(setOutputVolumeReduced))
slider_outputVolume.addEventListener("slideEnd", detailWrap(setOutputVolume))
tab_createLabel(tab, "Output volume", slider_outputVolume)

const slider_inputVolume = createSlider(getInputVolume())
slider_inputVolume.addEventListener("slide", detailWrap(setInputVolumeReduced))
slider_inputVolume.addEventListener("slideEnd", detailWrap(setInputVolume))
tab_createLabel(tab, "Output volume", slider_inputVolume)

addKioskSetupTab("Audio", tab)

})();