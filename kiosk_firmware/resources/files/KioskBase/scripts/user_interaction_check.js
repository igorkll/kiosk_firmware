{
    let lastX = null, lastY = null, lastTime = null
    const MIN_SPEED = 512

    function user_interaction_trigger() {
        if (codeInWebview) {
            kiosk_firmware_internals.user_interaction()
        } else {
            document.dispatchEvent(new CustomEvent('user_interaction'))
        }
    }

    function handlePointerMove(event) {
        let x, y
        if (event.touches) {
            x = event.touches[0].clientX
            y = event.touches[0].clientY
        } else {
            x = event.clientX
            y = event.clientY
        }

        const now = performance.now()

        if (lastX !== null && lastY !== null && lastTime !== null) {
            const dx = x - lastX
            const dy = y - lastY
            const dt = (now - lastTime) / 1000
            const speed = Math.sqrt(dx*dx + dy*dy) / dt

            if (speed >= MIN_SPEED) {
                user_interaction_trigger()
            }
        }

        lastX = x
        lastY = y
        lastTime = now
    }

    function handleOther(event) {
        user_interaction_trigger()
    }

    document.addEventListener('mousemove', handlePointerMove)
    document.addEventListener('touchmove', handlePointerMove, { passive: true })
    document.addEventListener('touchstart', handleOther)
    document.addEventListener('keydown', handleOther)
    document.addEventListener('wheel', handleOther)
}
