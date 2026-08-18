function __split(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_\-\s]+/g, ' ')
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0)
}

function titleCase(str) {
    return __split(str)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ')
}

function snakeCase(str) {
    return __split(str).join('_')
}

function screamingCase(str) {
    return __split(str).join('_').toUpperCase()
}

function kebabCase(str) {
    return __split(str).join('-')
}

function pascalCase(str) {
    return __split(str)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join('')
}

function camelCase(str) {
    let pascalCaseStr = pascalCase(str)
    return pascalCaseStr[0].toLowerCase() + pascalCaseStr.slice(1)
}

function lowerCase(str) {
    return __split(str).join(' ')
}

function upperCase(str) {
    return __split(str).join(' ').toUpperCase()
}

function sentenceCase(str) {
    let lowerCaseStr = lowerCase(str)
    return lowerCaseStr[0].toUpperCase() + lowerCaseStr.slice(1)
}

