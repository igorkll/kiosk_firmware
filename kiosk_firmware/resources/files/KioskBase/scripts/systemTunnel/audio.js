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

window.getOutput = function() {
    return getVolume("@DEFAULT_SINK@")
}

window.getInput = function() {
    return getVolume("@DEFAULT_SOURCE@")
}

// async

window.getOutputAsync = async function() {
    return await getVolumeAsync("@DEFAULT_SINK@")
}

window.getInputAsync = async function() {
    return await getVolumeAsync("@DEFAULT_SOURCE@")
}

// -------------------------------------- get input/output wrap

window.getOutputVolume = function() {
    return getVolume("@DEFAULT_SINK@").volume
}

window.getInputVolume = function() {
    return getVolume("@DEFAULT_SOURCE@").volume
}

window.getOutputMuted = function() {
    return getVolume("@DEFAULT_SINK@").muted
}

window.getInputMuted = function() {
    return getVolume("@DEFAULT_SOURCE@").muted
}

// async

window.getOutputVolumeAsync = async function() {
    return (await getVolumeAsync("@DEFAULT_SINK@")).volume
}

window.getInputVolumeAsync = async function() {
    return (await getVolumeAsync("@DEFAULT_SOURCE@")).volume
}

window.getOutputMutedAsync = async function() {
    return (await getVolumeAsync("@DEFAULT_SINK@")).muted
}

window.getInputMutedAsync = async function() {
    return (await getVolumeAsync("@DEFAULT_SOURCE@")).muted
}

// -------------------------------------- set input/output

window.setOutputVolume = function(volume) {
    exec(`wpctl set-volume @DEFAULT_SINK@ ${volume}`, (error, stdout, stderr) => {})
}

window.setInputVolume = function(volume) {
    exec(`wpctl set-volume @DEFAULT_SOURCE@ ${volume}`, (error, stdout, stderr) => {})
}

})();