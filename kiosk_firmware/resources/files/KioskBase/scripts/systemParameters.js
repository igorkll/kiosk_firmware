(function() {

updateDefaultInStorage("systemVolume", 0.4)

window.updateSystemVolume = function() {
    let systemVolume = storage.get("systemVolume")
    exec(`wpctl set-volume @DEFAULT_SINK@ ${systemVolume}`, (error, stdout, stderr) => {});
}

updateSystemVolume()

})();