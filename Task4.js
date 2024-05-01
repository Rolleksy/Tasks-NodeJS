function getArrayIntersection(array1, array2) {
    return array1.filter(element => array2.includes(element));
}
function getArrayUnion(array1, array2) {
    const unionSet = new Set([...array1, ...array2]);
    return Array.from(unionSet);
}

module.exports = 
{
    getArrayIntersection,
    getArrayUnion
};

// Test

const arr1 = [1, 2, 3, 4, 5];
const arr2 = [4, 5, 6, 7, 8];

const intersection = getArrayIntersection(arr1, arr2);
console.log(intersection);

const union = getArrayUnion(arr1, arr2);
console.log(union);
