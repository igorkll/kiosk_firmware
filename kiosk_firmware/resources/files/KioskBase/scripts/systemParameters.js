(function() {

function parseVolume(stdout) {
    const volumeMatch = stdout.match(/Volume:\s*([\d.]+)/)
    const mutedMatch = stdout.match(/\[MUTED\]/)
    return {
        volume: volumeMatch ? parseFloat(volumeMatch[1]) : null,
        muted: !!mutedMatch
    }
}

async function getVolume(device) {
    try {
        const stdout = await execPromise(`wpctl get-volume ${device}`);
        return parseVolume(stdout);
    } catch (error) {
        console.error(`Failed get volume for device "${device}":`, error);
        return { volume: 0, muted: false };
    }
};

window.getOutputVolume = function() {
    return 0.4
}

window.getInputVolume = function() {
    return 1
}

window.setOutputVolume = function(volume) {
    exec(`wpctl set-volume @DEFAULT_SINK@ ${volume}`, (error, stdout, stderr) => {})
}

window.setInputVolume = function(volume) {
    exec(`wpctl set-volume @DEFAULT_SOURCE@ ${volume}`, (error, stdout, stderr) => {})
}

})();