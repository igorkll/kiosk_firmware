(function() {

const { clipboard } = require('electron')

window.system_clearClipboard = function() {
    clipboard.clear()
}

window.system_openTerminalAsync = function() {
    return execPromise("weston-terminal")
}

})();