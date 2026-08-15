{

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
    console.log("change_case global", change_case)
    labelObject.textContent = change_case.capitalCase(parameter)

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