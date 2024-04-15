const dataTransformation = require('./dataTransformation');

// Test addValues function
console.log("Testing addValues function:");
try {
    console.log("addValues(5, 3) =", dataTransformation.addValues(5, 3)); // Expected output: 8
    console.log("addValues('5', '3') =", dataTransformation.addValues('5', '3')); // Expected output: 8
    console.log("addValues('abc', 3) =", dataTransformation.addValues('abc', 3)); // Expected Error
    console.log("addValues(5, '3') =", dataTransformation.addValues(5, '3')); // Expected output: 8
} catch (error) {
    console.error(error.message);
}
console.log("-----------------------------");

// Test stringifyValue function
console.log("Testing stringifyValue function:");
console.log("stringifyValue(42) =", dataTransformation.stringifyValue(42)); // Expected output: "42"
console.log("stringifyValue('Hello') =", dataTransformation.stringifyValue('Hello')); // Expected output: "Hello"
console.log("stringifyValue({ name: 'John', age: 30 }) =", dataTransformation.stringifyValue({ name: 'John', age: 30 })); // Expected output: '{"name":"John","age":30}'
console.log("-----------------------------");

// Test invertBoolean function
console.log("Testing invertBoolean function:");
console.log("invertBoolean(true) =", dataTransformation.invertBoolean(true)); // Expected output: false
console.log("invertBoolean(false) =", dataTransformation.invertBoolean(false)); // Expected output: true
try {
    console.log("invertBoolean(0) =", dataTransformation.invertBoolean(0)); // Expected Error
} catch (error) {
    console.error(error.message);
}
console.log("-----------------------------");

// Test convertToNumber function
console.log("Testing convertToNumber function:");
console.log("convertToNumber('42') =", dataTransformation.convertToNumber('42')); // Expected output: 42
console.log("convertToNumber('3.14') =", dataTransformation.convertToNumber('3.14')); // Expected output: 3.14
console.log("convertToNumber(true) =", dataTransformation.convertToNumber(true)); // Expected output: 1
try {
    console.log("convertToNumber('abc') =", dataTransformation.convertToNumber('abc')); // Expected Error
} catch (error) {
    console.error(error.message);
}
console.log("-----------------------------");

// Test coerceToType function
console.log("Testing coerceToType function:");
console.log("coerceToType('42', 'number') =", dataTransformation.coerceToType('42', 'number')); // Expected output: 42
console.log("coerceToType('42.6', 'number') =", dataTransformation.coerceToType('42.6', 'number')); // Expected output: 42.6
console.log("coerceToType(42, 'string') =", dataTransformation.coerceToType(42, 'string')); // Expected output: "42"
console.log("coerceToType(true, 'boolean') =", dataTransformation.coerceToType(true, 'boolean')); // Expected output: true
console.log("coerceToType({ name: 'John' }, 'string') =", dataTransformation.coerceToType({ name: 'John' }, 'string')); // Expected output: '{"name":"John"}'
console.log("-----------------------------");
