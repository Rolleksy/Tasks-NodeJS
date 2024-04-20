function calculateFactorial(n, accumulator = 1) {
    if (n === 0) {
        return accumulator;
    }
    return calculateFactorial(n - 1, n * accumulator);
}

function power(base, exponent, result = 1) {
    if (exponent === 0) {
        return result;
    }
    return power(base, exponent - 1, result * base);
}

// Test - Task 4

console.log(calculateFactorial(5)); // result: 120 (5! = 5 * 4 * 3 * 2 * 1)
console.log(power(2, 3)); // result: 8 (2^3 = 2 * 2 * 2)
