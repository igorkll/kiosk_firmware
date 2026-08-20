(function() {

window.power_reboot = function() {
    execSync("/sbin/reboot")
}

window.power_shutdown = function() {
    execSync("/sbin/poweroff")
}

window.power_rebootAsync = function() {
    return execPromise("/sbin/reboot")
}

window.power_shutdownAsync = function() {
    return execPromise("/sbin/poweroff")
}

})();