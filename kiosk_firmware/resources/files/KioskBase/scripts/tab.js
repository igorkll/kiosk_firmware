(function() {

const overlay_buttons_host = document.getElementById("overlay-buttons-host")
const overlay_tabs = document.getElementById("overlay-tabs")

let maxButtonsInLine = 3

function addButtonToLine(button) {
    let lastLine = overlay_buttons_host.lastElementChild
    if (lastLine == null || lastLine.children.length >= maxButtonsInLine) {
        lastLine = document.createElement("div")
        lastLine.classList.add("line-container")
        overlay_buttons_host.appendChild(lastLine)
    }
    lastLine.appendChild(button)
}

let allTabs = []
let oldActiveTabIndex = null

window.selectKioskSetupTab = function(index) {
    if (oldActiveTabIndex != null) {
        let oldTab = allTabs[oldActiveTabIndex]
        oldTab.style.display = "none"
        oldTab.active_button.classList.remove("tab-button-selected")
    }

    let tab = allTabs[index]
    tab.style.display = ""
    tab.active_button.classList.add("tab-button-selected")

    const parent = tab.last_line.parentNode;
    parent.appendChild(tab.last_line)
    
    oldActiveTabIndex = index
}

let lastIndex = 0
window.addKioskSetupTab = function(name, tab) {
    let button = document.createElement("button")
    button.classList.add("tab-button")
    button.textContent = name

    addButtonToLine(button)
    
    const index = lastIndex
    lastIndex++

    button.addEventListener("click", () => {
        selectKioskSetupTab(index)
    })

    tab.style.display = "none"
    tab.active_button = button
    tab.last_line = overlay_buttons_host.lastElementChild
    overlay_tabs.appendChild(tab)
    allTabs.push(tab)
}

window.tab_create = function() {
    let tab = document.createElement("div")
    tab.classList.add("tab")
    return tab
}

window.tab_createInput = function(container, parameter, onChangeCallback=null, min=null, max=null, title=null) {
    let parameterValue = storage.get(parameter)
    let parameterType = typeof(parameterValue)

    let inputObjectType
    switch (parameterType) {
        case "number":
            inputObjectType = "number"
            break;

        case "boolean":
            inputObjectType = "checkbox"
            break;

        case "string":
            inputObjectType = "text"
            break;
    }

    const inputObject = document.createElement('input')
    inputObject.type = inputObjectType
    switch (parameterType) {
        case "number":
            inputObject.valueAsNumber = parameterValue
            break;

        case "boolean":
            inputObject.checked = parameterValue
            break;

        case "string":
            inputObject.value = parameterValue
            break;
    }

    inputObject.addEventListener("change", () => {
        switch (parameterType) {
            case "number":
                inputObject.valueAsNumber = Math.min(Math.max(inputObject.valueAsNumber, min), max)
                storage.set(parameter, inputObject.valueAsNumber)
                break;
    
            case "boolean":
                storage.set(parameter, inputObject.checked)
                break;
    
            case "string":
                storage.set(parameter, inputObject.value)
                break;
        }
        onChangeCallback()
    })

    tab_createLabel(container, title || tocase.sentenceCase(parameter), inputObject)
}

window.tab_createButton = function(container, title, callback) {
    const buttonObject = document.createElement('input')
    buttonObject.type = "button"
    buttonObject.value = title

    buttonObject.addEventListener("click", callback)

    container.appendChild(buttonObject)
}

window.tab_createLabel = function(container, title, forElement=null) {
    const labelObject = document.createElement('label')
    labelObject.textContent = title

    if (forElement != null) {
        const parameterLine = document.createElement('div')
        parameterLine.classList.add("line-container")
        parameterLine.appendChild(forElement)
        parameterLine.appendChild(labelObject)
        container.appendChild(parameterLine)
    } else {
        container.appendChild(labelObject)
    }
}

window.tab_createSlider = function(container, parameter, onChangeCallback=null, title=null) {
    let value = storage.get(parameter)
    let sliderObject = createSlider(value)

    container.appendChild(parameterLine)
    tab_createLabel(container, title || tocase.sentenceCase(parameter), sliderObject)

    sliderObject.addEventListener("slide", (event) => {
        value = event.detail
        storage.set(parameter, value)
        onChangeCallback(false)
    })

    sliderObject.addEventListener("slideEnd", () => {
        onChangeCallback(true)
    })
}

})();