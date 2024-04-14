const { plus, minus, multiply, divide } = require('./calculate');

// Example string numbers
let x = "1000000000000000000000 ";
let y = "123";

// Perform operations
// Sum
let resultSum = x.plus(y);
console.log("Sum: ");
console.log(`${x} + ${y} = `);
console.log(resultSum);
console.log("\n");

// Subtract
let resultSubtract = x.minus(y);
console.log("Subtract: ");
console.log(`${x} - ${y} = `);
console.log(resultSubtract); 
console.log("\n");

// Multiply
let resultMultiply = x.multiply(y);
console.log("Multiply: ");
console.log(`${x} * ${y} = `);
console.log(resultMultiply);
console.log("\n");

// Divide
let resultDivide = x.divide(y);
console.log("Divide: ");
console.log(`${x} / ${y} = `);
console.log(resultDivide);
console.log("\n");
