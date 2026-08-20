let tocase = {};

(function() {

function __split(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_\-\s]+/g, ' ')
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0)
}

tocase.titleCase = function (str) {
    if (str.length == 0) return ""
    return __split(str)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ')
}

tocase.snakeCase = function (str) {
    if (str.length == 0) return ""
    return __split(str).join('_')
}

tocase.screamingCase = function (str) {
    if (str.length == 0) return ""
    return __split(str).join('_').toUpperCase()
}

tocase.kebabCase = function (str) {
    if (str.length == 0) return ""
    return __split(str).join('-')
}

tocase.pascalCase = function (str) {
    if (str.length == 0) return ""
    return __split(str)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join('')
}

tocase.camelCase = function (str) {
    if (str.length == 0) return ""
    let pascalCaseStr = tocase.pascalCase(str)
    return pascalCaseStr[0].toLowerCase() + pascalCaseStr.slice(1)
}

tocase.lowerCase = function (str) {
    if (str.length == 0) return ""
    return __split(str).join(' ')
}

tocase.upperCase = function (str) {
    if (str.length == 0) return ""
    return __split(str).join(' ').toUpperCase()
}

tocase.sentenceCase = function (str) {
    if (str.length == 0) return ""
    let lowerCaseStr = tocase.lowerCase(str)
    return lowerCaseStr[0].toUpperCase() + lowerCaseStr.slice(1)
}

})();


