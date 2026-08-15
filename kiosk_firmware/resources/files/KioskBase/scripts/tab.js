{

window.tab_createInput = function(container, parameter, onChangeCallback=null, min, max) {
    let type = typeof(storage.get(parameter))

    let inputObjectType
    switch (type) {
        case "number":
            inputObjectType = "checkbox"
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
    inputObject.value = 'on'
    document.body.appendChild(inputObject)

    container.appendChild(inputObject)
}

}