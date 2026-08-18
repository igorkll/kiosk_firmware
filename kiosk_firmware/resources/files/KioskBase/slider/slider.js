(function() {

window.createSlider = function(value) {
    let slider = document.createElement("div")
    slider.classList.add("slider")

    let sliderBody = document.createElement("div")
    sliderBody.classList.add("slider-body")

    
    slider.appendChild(sliderBody)


    return slider
}

})();