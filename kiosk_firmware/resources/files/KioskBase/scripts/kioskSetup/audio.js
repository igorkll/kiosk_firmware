(function() {

const tab = tab_create()

const setOutputVolumeReduced = reduceNumberOfCalls(setOutputVolume)
const setInputVolumeReduced = reduceNumberOfCalls(setInputVolume)

// -------------------------- 

const slider_outputVolume = createSlider(getOutputVolume())
slider_outputVolume.addEventListener("slide", detailWrap(setOutputVolumeReduced))
slider_outputVolume.addEventListener("slideEnd", detailWrap(setOutputVolume))

const slider_inputVolume = createSlider(getInputVolume())
slider_inputVolume.addEventListener("slide", detailWrap(setInputVolumeReduced))
slider_inputVolume.addEventListener("slideEnd", detailWrap(setInputVolume))

// -------------------------- 

function updateOutputSlider() {
    slider_outputVolume.setValue(getOutputVolume())
}

function updateInputSlider() {
    slider_inputVolume.setValue(getInputVolume())
}

// -------------------------- 

tab_createLabel(tab, "Output volume", slider_outputVolume)
tab_createLabel(tab, "Input volume", slider_inputVolume)

addKioskSetupTab("Audio", tab)

})();