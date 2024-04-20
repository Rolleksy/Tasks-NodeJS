function lazyMap(array, mappingFunction) {
    let index = 0;
    return {
        next: function() {
            if (index < array.length) {
                return { value: mappingFunction(array[index++])};
            } else {
                return undefined;
            }
        }
    };
}

function fibonacciGenerator() {
    let previous = 0;
    let current = 1;
    return {
        next: function() {
            const next = previous + current;
            previous = current;
            current = next;
            return previous;
        }
    };
}
// Task 5 - Test

// Lazy map example
const numbers = [1, 2, 3, 4, 5];
const lazyMapped = lazyMap(numbers, num => num * 2);
for (let i = 0; i < numbers.length; i++) {
    console.log(lazyMapped.next());
}

console.log("-----");

// Fibonacci generator example
const fibonacci = fibonacciGenerator();

for (let i = 0; i < 10; i++) {
    console.log(fibonacci.next());
}

