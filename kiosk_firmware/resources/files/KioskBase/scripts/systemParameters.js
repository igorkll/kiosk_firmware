(function() {

window.setOutputVolume = function(volume) {
    exec(`wpctl set-volume @DEFAULT_SINK@ ${volume}`, (error, stdout, stderr) => {})
}

window.setInputVolume = function(volume) {
    exec(`wpctl set-volume @DEFAULT_SOURCE@ ${volume}`, (error, stdout, stderr) => {})
}

})();