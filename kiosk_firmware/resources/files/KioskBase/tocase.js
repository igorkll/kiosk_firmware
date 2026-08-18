let tocase = {}

{

function __split(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_\-\s]+/g, ' ')
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0)
}

tocase.titleCase = function (str) {
    return __split(str)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ')
}

tocase.snakeCase = function snakeCase(str) {
    return __split(str).join('_')
}

tocase.screamingCase = function screamingCase(str) {
    return __split(str).join('_').toUpperCase()
}

tocase.kebabCase = function kebabCase(str) {
    return __split(str).join('-')
}

tocase.pascalCase = function pascalCase(str) {
    return __split(str)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join('')
}

tocase.camelCase = function camelCase(str) {
    let pascalCaseStr = pascalCase(str)
    return pascalCaseStr[0].toLowerCase() + pascalCaseStr.slice(1)
}

tocase.lowerCase = function lowerCase(str) {
    return __split(str).join(' ')
}

tocase.upperCase = function upperCase(str) {
    return __split(str).join(' ').toUpperCase()
}

tocase.sentenceCase = function sentenceCase(str) {
    let lowerCaseStr = lowerCase(str)
    return lowerCaseStr[0].toUpperCase() + lowerCaseStr.slice(1)
}

}


