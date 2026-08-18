(function() {

window.createSlider = function(value) {
    let slider = document.createElement("div")
    slider.classList.add("slider")

    let sliderBody = document.createElement("div")
    sliderBody.classList.add("slider-body")
    slider.appendChild(sliderBody)

    let sliderDot = document.createElement("div")
    sliderDot.classList.add("slider-dot")
    slider.appendChild(sliderDot)

    let forceUpdateDotTimer = null

    function updateDot() {
        if (sliderBody.offsetWidth > 0) {
            sliderDot.style.left = `${(sliderBody.offsetWidth - sliderDot.offsetWidth) * value}px`
            sliderDot.textContent = `${Math.floor(value * 100)}%`
            clearInterval(forceUpdateDotTimer)
        }
    }

    let isPointing = false

    function update() {
        if (isPointing && sliderBody.offsetWidth > 0) {
            let localValue = (event.clientX - slider.getBoundingClientRect().left) / sliderBody.offsetWidth
            localValue = Math.min(1, Math.max(localValue, 0))
            value = localValue
            updateDot()
            slider.dispatchEvent(new CustomEvent("slide", {detail: localValue}))
        }
    }

    slider.addEventListener("pointerdown", () => {
        isPointing = true
        update()
    })

    document.addEventListener("pointermove", (event) => {
        update()
    })

    document.addEventListener("pointerup", () => {
        isPointing = false
    })

    forceUpdateDotTimer = setInterval(updateDot, 100)
    updateDot()

    return slider
}

})();