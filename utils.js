// Generate colliding pairs for the hash table using the hash function from given hash table
function generateCollidingPairs(numPairs, hashTable) {
    const collidingPairs = [];
    const hashMap = new Map(); // Do przechowywania kluczy i ich hashy

    let pairIndex = 1;

    while (collidingPairs.length < numPairs * 2) {
        const key1 = generateRandomKey();
        const key2 = generateRandomKey();

        const hash1 = hashTable.hashFunction(key1);
        const hash2 = hashTable.hashFunction(key2);

        if (hash1 === hash2 && key1 !== key2) {
            if (!hashMap.has(hash1)) {
                hashMap.set(hash1, [[key1, `Colliding Value ${pairIndex}.1`], [key2, `Colliding Value ${pairIndex}.2`]]);
                collidingPairs.push([key1, `Colliding Value ${pairIndex}.1`]);
                collidingPairs.push([key2, `Colliding Value ${pairIndex}.2`]);
                pairIndex++;
            }
        }
    }

    return collidingPairs;
}

// Generate random keys
function generateRandomKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
// Generate given number of keys and values pairs for the hash table
function generateKeysAndValues(numberOfKeys) {
    const keys = [];
    for (let i = 0; i < numberOfKeys; i++) {
        let pair = [generateRandomKey(), `RandomValue_${i}`];
        keys.push(pair);
    }
    return keys;
}

function measurePerformance(func){
    const start = process.hrtime();
    func();
    const end = process.hrtime(start);
    return end[0] * 1000 + end[1] / 1000000;
}

module.exports = { generateCollidingPairs, generateKeysAndValues, measurePerformance };