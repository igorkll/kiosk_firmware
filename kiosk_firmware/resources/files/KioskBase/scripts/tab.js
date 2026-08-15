{

window.tab_create = function(parameter, onChangeCallback=null, min, max) {
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

    const checkbox = document.createElement('input')
    checkbox.type = inputObjectType
    checkbox.value = 'on'
    document.body.appendChild(checkbox)
}

}