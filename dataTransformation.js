function addValues(a, b) {
    if (typeof a === 'string' && typeof b === 'string') {
        a = parseFloat(a);
        b = parseFloat(b);

        if (isNaN(a) || isNaN(b)) {
            throw new Error('Both arguments must be numbers');
        }
        return a + b;
    }
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Both arguments must be numbers');
    }
    return a + b
}

function stringifyValue(a) {
    if (typeof a === 'object') {
        return JSON.stringify(a);
    }
    return String(a)
}

function invertBoolean(a) {
    if (typeof a !== 'boolean') {
        throw new Error('Argument must be a boolean');
    }
    return !a
}

function convertToNumber(a) {
    if (typeof a === 'string') {
        if (a.includes('.') || a.includes(',')) {
            return parseFloat(a)
        }
        return parseInt(a)
    }
    return Number(a)
}

function coerceToType(a, type) {
  switch (type) {
    case 'number':
      return convertToNumber(a)
    case 'string':
        return stringifyValue(a)
    case 'boolean':
      return !!a
    default:
      return a
  }
}

module.exports = {
    addValues,
    stringifyValue,
    invertBoolean,
    convertToNumber,
    coerceToType
}