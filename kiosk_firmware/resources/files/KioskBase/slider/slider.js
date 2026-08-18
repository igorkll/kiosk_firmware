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

    return slider
}

})();