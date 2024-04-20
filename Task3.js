function createCounter() {
    let count = 0; 

    return function counter() {
        return ++count;
    };
}

function repeatFunction(func, times) {
    if (times < 0) {
        // if the number is negative, return a function that will call the original function indefinitely
        return function() {
            while (true) {
                func();
            }
        };
    } else {
        // if the number is positive, return a function that will call the original function the specified number of times
        return function() {
            for (let i = 0; i < times; i++) {
                func();
            }
        };
    }
}

// Test - Task 3

const counter1 = createCounter();
console.log(counter1()); // result: 1
console.log(counter1()); // result: 2

const counter2 = createCounter();
console.log(counter2()); // result: 1

const printHello = () => console.log("Hello");
const repeatHello = repeatFunction(printHello, 3);
repeatHello();

const repeatHelloIndefinitely = repeatFunction(printHello, -1);
