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

// -------------------------------------- get default devices

function parseDefaultDevice(stdout) {
    // Пример: "Default sink: id:49, name:alsa_output.pci-0000_00_1f.3.analog-stereo"
    const match = stdout.match(/id:(\d+),\s*name:([^,\n]+)/);
    if (match) {
        return { id: parseInt(match[1]), name: match[2].trim() };
    }
    return null;
}

window.audio_getDefaultOutput = function() {
    try {
        const stdout = execSync('wpctl get-default sink', {encoding: 'utf8'});
        return parseDefaultDevice(stdout);
    } catch (error) {
        console.error('Failed to get default sink:', error);
        return null;
    }
};

window.audio_getDefaultInput = function() {
    try {
        const stdout = execSync('wpctl get-default source', {encoding: 'utf8'});
        return parseDefaultDevice(stdout);
    } catch (error) {
        console.error('Failed to get default source:', error);
        return null;
    }
};

window.audio_getDefaultAny = function(deviceType) {
    try {
        const stdout = execSync(`wpctl get-default ${deviceType}`, {encoding: 'utf8'});
        return parseDefaultDevice(stdout);
    } catch (error) {
        console.error(`Failed to get default ${deviceType}:`, error);
        return null;
    }
};

// async versions
window.audio_getDefaultOutputAsync = async function() {
    try {
        const {stdout} = await execPromise('wpctl get-default sink');
        return parseDefaultDevice(stdout);
    } catch (error) {
        console.error('Failed to get default sink async:', error);
        return null;
    }
};

window.audio_getDefaultInputAsync = async function() {
    try {
        const {stdout} = await execPromise('wpctl get-default source');
        return parseDefaultDevice(stdout);
    } catch (error) {
        console.error('Failed to get default source async:', error);
        return null;
    }
};

window.audio_getDefaultAnyAsync = async function(deviceType) {
    try {
        const {stdout} = await execPromise(`wpctl get-default ${deviceType}`);
        return parseDefaultDevice(stdout);
    } catch (error) {
        console.error(`Failed to get default ${deviceType} async:`, error);
        return null;
    }
};

// -------------------------------------- list devices

function parseDeviceList(stdout, type) {
    // type: 'Sinks' или 'Sources'
    const devices = [];
    const lines = stdout.split('\n');
    let inTargetSection = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Ищем начало секции, например "├─ Sinks:" или просто "Sinks:"
        if (line.includes(`${type}:`)) {
            inTargetSection = true;
            continue;
        }

        if (inTargetSection) {
            // Если встретили пустую строку или следующую секцию (endpoints, Devices, Streams) – выходим
            if (line.trim() === '' || 
                line.includes('endpoints:') || 
                line.includes('Devices:') || 
                line.includes('Streams:')) {
                // Если это другая секция типа "Sinks:" или "Sources:" – останавливаемся
                if (line.includes('Sinks:') || line.includes('Sources:') || 
                    line.includes('Devices:') || line.includes('endpoints:')) {
                    break;
                }
                continue; // пропускаем пустые строки внутри секции
            }

            // Строка с устройством: начинается с "│", может содержать "*" для дефолтного
            // Примеры:
            // "│  *   46. Starship/Matisse HD Audio Controller Analog Stereo [vol: 0.80]"
            // "│      52. GA104 High Definition Audio Controller Digital Stereo (HDMI) [vol: 0.52]"
            const match = line.match(/^\s*│\s*(?:\*\s+)?(\d+)\.\s*(.+?)(?:\s*\[.*\])?$/);
            if (match) {
                devices.push({
                    id: parseInt(match[1]),
                    name: match[2].trim()
                });
            }
        }
    }
    return devices;
}

window.audio_getOutputsList = function() {
    try {
        const stdout = execSync('wpctl status', {encoding: 'utf8'});
        return parseDeviceList(stdout, 'Sinks');
    } catch (error) {
        console.error('Failed to get sinks:', error);
        return [];
    }
};

window.audio_getInputsList = function() {
    try {
        const stdout = execSync('wpctl status', {encoding: 'utf8'});
        return parseDeviceList(stdout, 'Sources');
    } catch (error) {
        console.error('Failed to get sources:', error);
        return [];
    }
};

function convertDeviceTypeToListType(deviceType) {
    return tocase.sentenceCase(deviceType) + "s"
}

window.audio_getAnyList = function(deviceType) {
    try {
        const stdout = execSync('wpctl status', {encoding: 'utf8'});
        return parseDeviceList(stdout, convertDeviceTypeToListType(deviceType));
    } catch (error) {
        console.error(`Failed to get ${deviceType}:`, error);
        return [];
    }
};

// async
window.audio_getOutputsListAsync = async function() {
    try {
        const {stdout} = await execPromise('wpctl status');
        return parseDeviceList(stdout, 'Sinks');
    } catch (error) {
        console.error('Failed to get sinks async:', error);
        return [];
    }
};

window.audio_getInputsListAsync = async function() {
    try {
        const {stdout} = await execPromise('wpctl status');
        return parseDeviceList(stdout, 'Sources');
    } catch (error) {
        console.error('Failed to get sources async:', error);
        return [];
    }
};

window.audio_getAnyListAsync = async function(deviceType) {
    try {
        const {stdout} = await execPromise('wpctl status');
        return parseDeviceList(stdout, convertDeviceTypeToListType(deviceType));
    } catch (error) {
        console.error(`Failed to get ${deviceType} async:`, error);
        return [];
    }
};

// -------------------------------------- set default device

window.audio_setDefault = function(id) {
    try {
        execSync(`wpctl set-default ${id}`);
    } catch (error) {
        console.error(`Failed to set default sink to ${id}:`, error);
    }
};

// async
window.audio_setDefaultAsync = function(id) {
    return execPromise(`wpctl set-default ${id}`)
};

})();