function chunkArray(arr, size) {
    const chunkedArray = [];
    let index = 0;

    while (index < arr.length) {
        chunkedArray.push(arr.slice(index, index + size));
        index += size;
    }

    return chunkedArray;
}

module.exports = {chunkArray};

// Test 

const arr10 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const size2 = 2;

const arr9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const size3 = 3;

const chunkedArray = chunkArray(arr10, size2);
console.log(chunkedArray);

const chunkedArray2 = chunkArray(arr9, size3);
console.log(chunkedArray2);

const chunkedArray3 = chunkArray(arr10, size3);
console.log(chunkedArray3);