(function() {

// -------------------------------------- service functions

function parseVolume(stdout) {
    const volumeMatch = stdout.match(/Volume:\s*([\d.]+)/)
    const mutedMatch = stdout.match(/\[MUTED\]/)
    return {
        volume: volumeMatch ? parseFloat(volumeMatch[1]) : null,
        muted: !!mutedMatch
    }
}

async function getVolumeAsync(device) {
    try {
        const {stdout} = await execPromise(`wpctl get-volume ${device}`)
        return parseVolume(stdout)
    } catch (error) {
        console.error(`Failed get volume for device "${device}":`, error)
        return { volume: 0, muted: false }
    }
}

function getVolume(device) {
    try {
        const stdout = execSync(`wpctl get-volume ${device}`, {encoding: 'utf8'})
        return parseVolume(stdout)
    } catch (error) {
        console.error(`Failed get volume for device "${device}":`, error)
        return { volume: 0, muted: false }
    }
}

// -------------------------------------- get input/output

window.audio_getOutput = function() {
    return getVolume("@DEFAULT_SINK@")
}

window.audio_getInput = function() {
    return getVolume("@DEFAULT_SOURCE@")
}

// async

window.audio_getOutputAsync = async function() {
    return await getVolumeAsync("@DEFAULT_SINK@")
}

window.audio_getInputAsync = async function() {
    return await getVolumeAsync("@DEFAULT_SOURCE@")
}

// -------------------------------------- get input/output wrap

window.audio_getOutputVolume = function() {
    return getVolume("@DEFAULT_SINK@").volume
}

window.audio_getInputVolume = function() {
    return getVolume("@DEFAULT_SOURCE@").volume
}

window.audio_getOutputMuted = function() {
    return getVolume("@DEFAULT_SINK@").muted
}

window.audio_getInputMuted = function() {
    return getVolume("@DEFAULT_SOURCE@").muted
}

// async

window.audio_getOutputVolumeAsync = async function() {
    return (await getVolumeAsync("@DEFAULT_SINK@")).volume
}

window.audio_getInputVolumeAsync = async function() {
    return (await getVolumeAsync("@DEFAULT_SOURCE@")).volume
}

window.audio_getOutputMutedAsync = async function() {
    return (await getVolumeAsync("@DEFAULT_SINK@")).muted
}

window.audio_getInputMutedAsync = async function() {
    return (await getVolumeAsync("@DEFAULT_SOURCE@")).muted
}

// -------------------------------------- set input/output

window.audio_setOutputVolume = function(volume) {
    execSync(`wpctl set-volume @DEFAULT_SINK@ ${volume}`)
}

window.audio_setInputVolume = function(volume) {
    execSync(`wpctl set-volume @DEFAULT_SOURCE@ ${volume}`)
}

window.audio_setOutputMuted = function(muted) {
    if (muted == true) muted = 1
    if (muted == false) muted = 0
    execSync(`wpctl set-mute @DEFAULT_SINK@ ${muted}`)
}

window.audio_setInputMuted = function(muted) {
    if (muted == true) muted = 1
    if (muted == false) muted = 0
    execSync(`wpctl set-mute @DEFAULT_SOURCE@ ${muted}`)
}

window.audio_setOutputVolumeAsync = function(volume) {
    return execPromise(`wpctl set-volume @DEFAULT_SINK@ ${volume}`)
}

window.audio_setInputVolumeAsync = function(volume) {
    return execPromise(`wpctl set-volume @DEFAULT_SOURCE@ ${volume}`)
}

window.audio_setOutputMutedAsync = function(muted) {
    if (muted == true) muted = 1
    if (muted == false) muted = 0
    return execPromise(`wpctl set-mute @DEFAULT_SINK@ ${muted}`)
}

window.audio_setInputMutedAsync = function(muted) {
    if (muted == true) muted = 1
    if (muted == false) muted = 0
    return execPromise(`wpctl set-mute @DEFAULT_SOURCE@ ${muted}`)
}

})();