function measureArrayPerformance(func, array) {
    const start = performance.now();
    func(array);
    const end = performance.now();
    return end - start;
}

module.exports = {measureArrayPerformance};

// Test

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const arr2 = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const customShuffle = require('./Task3').customShuffle;

const customShuffleTime = measureArrayPerformance(customShuffle, arr);
console.log('Custom shuffle time:', customShuffleTime);

