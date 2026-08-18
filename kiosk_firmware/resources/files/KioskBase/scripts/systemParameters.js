(function() {

updateDefaultInStorage("outputVolume", 0.4)
updateDefaultInStorage("inputVolume", 1)

window.updateVolume = function() {
    let outputVolume = storage.get("outputVolume")
    let inputVolume = storage.get("inputVolume")

    exec(`wpctl set-volume @DEFAULT_SINK@ ${outputVolume}`, (error, stdout, stderr) => {})
    exec(`wpctl set-volume @DEFAULT_SOURCE@ ${inputVolume}`, (error, stdout, stderr) => {})
}

updateVolume()

})();