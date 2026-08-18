function __split(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/[_\-\s]+/g, ' ')
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0);
}

function capitalCase(str) {
    return __split(str)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ');
}

function snakeCase(str) {
    return __split(str).join('_');
}

function kebabCase(str) {
    return __split(str).join('-');
}

function pascalCase(str) {
    return __split(str)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join('');
}
