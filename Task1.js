function customFilterUnique(arr, callbackFn) {
    const uniqueArr = [];
    const uniqueValues = [];

    arr.forEach(element => {
        const value = callbackFn(element);
        if (!uniqueValues.includes(value)) {
            uniqueValues.push(value);
            uniqueArr.push(element);
        }
    });

    return uniqueArr;
}

const uniqueId = (item) => item.id;
const uniqueName = (item) => item.name; 
const uniquePet = (item) => item.pet;


module.exports = {customFilterUnique};

// Test
const arr = [
    { id: 1, name: 'Michael', pet: 'dog'},
    { id: 2, name: 'Janina', pet: 'cat' },
    { id: 3, name: 'Michael', pet: 'fish' },
    { id: 4, name: 'Jane', pet: 'bird'},
    { id: 5, name: 'Charles', pet: 'dog'},
    { id: 6, name: 'Janina', pet: 'cat'}
];

console.log('Filter by id: ')
const filteredArrayId = customFilterUnique(arr, uniqueId);
console.log(filteredArrayId);

console.log('Filter by name: ')
const filteredArrayName = customFilterUnique(arr, uniqueName);
console.log(filteredArrayName);

console.log('Filter by pet: ')
const filteredArrayPet = customFilterUnique(arr, uniquePet);
console.log(filteredArrayPet);
