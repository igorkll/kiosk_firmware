{

const overlay_buttons = document.getElementById("overlay-buttons")
const overlay_tabs = document.getElementById("overlay-tabs")

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
    
    oldActiveTabIndex = index
}

let lastIndex = 0
window.addKioskSetupTab = function(name, tab) {
    let button = document.createElement("button")
    button.classList.add("tab-button")
    button.textContent = name
    
    const index = lastIndex
    lastIndex++

    insertAt(overlay_buttons, button, index)
    
    button.addEventListener("click", () => {
        selectKioskSetupTab(index)
    })

    tab.style.display = "none"
    tab.active_button = button
    overlay_tabs.appendChild(tab)
    allTabs.push(tab)

    if (allTabs.length == 1) {
        selectKioskSetupTab(0)
    }
}

window.tab_create = function() {
    let tab = document.createElement("div")
    tab.classList.add("tab")
    return tab
}

window.tab_createInput = function(container, parameter, onChangeCallback=null, min, max) {
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

    const labelObject = document.createElement('label')
    labelObject.textContent = snakeCase(parameter)

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
    
    const parameterLine = document.createElement('div')
    parameterLine.classList.add("line-container")
    parameterLine.appendChild(inputObject)
    parameterLine.appendChild(labelObject)

    container.appendChild(parameterLine)

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
}

}