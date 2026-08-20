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

window.splitIdsAndNames = function(arr) {
    return {
        ids: arr.map(item => item.id),
        names: arr.map(item => item.name)
    }
}

let outputsListElement = null
let inputsListElement = null

async function createAudioDeviceSelecter(deviceType, callback, title) {
    const list = splitIdsAndNames(await audio_getAnyListAsync(deviceType))
    const current = await audio_getDefaultAnyAsync(deviceType)

    console.log(current)

    const names = list.names
    const ids = list.ids

    return tab_createLabel(tab, title + " list", createDropdownSimple(names, current, async (_, index) => {
        await audio_setDefaultAsync(ids[index])
        callback()
    }))
}

async function recreateDevicesLists() {
    if (outputsListElement != null) outputsListElement.remove()
    if (inputsListElement != null) inputsListElement.remove()

    outputsListElement = await createAudioDeviceSelecter("sink", updateOutputSlider, "Outputs")
    inputsListElement = await createAudioDeviceSelecter("source", updateInputSlider, "Inputs")
}

recreateDevicesLists()
setTimeout(recreateDevicesLists, 3000)

// --------------------------

tab_createLabel(tab, "Output volume", slider_outputVolume)
tab_createLabel(tab, "Input volume", slider_inputVolume)

addKioskSetupTab("Audio", tab)

})();