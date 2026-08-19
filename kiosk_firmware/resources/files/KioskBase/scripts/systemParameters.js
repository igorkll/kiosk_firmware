(function() {

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