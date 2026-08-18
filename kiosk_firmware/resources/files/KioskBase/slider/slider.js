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

    function updateDot() {
        sliderDot.style.left = `${(sliderBody.offsetWidth - sliderDot.offsetWidth) * value}px`
    }

    let isPointing = false

    slider.addEventListener("pointerdown", () => {
        isPointing = true
    })

    document.addEventListener("pointermove", () => {
        if (isPointing) {
            
        }
    })

    document.addEventListener("pointerup", () => {
        isPointing = false
    })

    setInterval(updateDot, 100)

    return slider
}

})();