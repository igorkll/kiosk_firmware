(function() {

const tab = tab_create()

const setOutputVolumeReduced = reduceNumberOfCalls(audio_setOutputVolumeAsync)
const setInputVolumeReduced = reduceNumberOfCalls(audio_setInputVolumeAsync)

// -------------------------- 

const slider_outputVolume = createSlider()
slider_outputVolume.addEventListener("slide", detailWrap(setOutputVolumeReduced))
slider_outputVolume.addEventListener("slideEnd", detailWrap(audio_setOutputVolumeAsync))

const slider_inputVolume = createSlider()
slider_inputVolume.addEventListener("slide", detailWrap(setInputVolumeReduced))
slider_inputVolume.addEventListener("slideEnd", detailWrap(audio_setInputVolumeAsync))

// -------------------------- 

async function updateOutputSlider() {
    slider_outputVolume.setValue(await audio_getOutputVolumeAsync())
}

async function updateInputSlider() {
    slider_inputVolume.setValue(await audio_getInputVolumeAsync())
}

updateOutputSlider()
updateInputSlider()

// -------------------------- 

tab_createLabel(tab, "Output volume", slider_outputVolume)
tab_createLabel(tab, "Input volume", slider_inputVolume)

addKioskSetupTab("Audio", tab)

})();