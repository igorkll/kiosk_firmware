const path = require('path')
const fs = require('fs')
const { app } = require('electron')
const { exec, execSync } = require('child_process');

const globalNodeModules = execSync('npm root -g').toString().trim()
const startTime = Date.now()

function getUptimeMs() {
    return Date.now() - startTime
}

function globalRequire(name) {
    return require(path.join(globalNodeModules, name))
}

function mergeTables(tbl, def) {
    for (let key in def) {
        if (!(key in tbl)) {
            tbl[key] = def[key]
        } else if (typeof def[key] === 'object' && def[key] != null && !Array.isArray(def[key])) {
            mergeTables[tbl[key], def[key]]
        }
    }
}

function keyHoldTrigger(callback, triggerActiveTime=5000, triggerResetTime=150) {
    let lastTriggerTimeMs = null
    let lastTriggerResetedTimeMs = null

    return () => {
        console.log(lastTriggerTimeMs, lastTriggerResetedTimeMs)
        let currentTime = getUptimeMs()

        if (lastTriggerResetedTimeMs == null || currentTime - lastTriggerTimeMs > triggerResetTime) {
            lastTriggerResetedTimeMs = currentTime
        }

        if (currentTime - lastTriggerResetedTimeMs > triggerActiveTime) {
            callback()
            lastTriggerResetedTimeMs = null
        }

        lastTriggerTimeMs = currentTime
    }
}
