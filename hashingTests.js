const { LinearHashTable } = require('./linearProbingHT');
const { QuadHashTable } = require('./quadraticProbingHT');
const { generateKeysAndValues, generateCollidingPairs } = require('./utils');

// Linear Probing hash table initialization

const hashTable = new LinearHashTable(1000);

// // Quadratic Probing hash table

const quadHashTable = new QuadHashTable(1000);

// ------------------------------------------------

// Generating test data

// Generate 200 pairs of keys and values
// parameter is the number of pairs to generate
const nonCollidingPairs = generateKeysAndValues(200);

// Generate colliding pairs for the hash table using the hash function from given hash table
// parameter is the number of pairs to generate and the hash table to use
const collidingPairs = generateCollidingPairs(20, hashTable);

// Combine colliding and non-colliding pairs
const readyPairs = collidingPairs.concat(nonCollidingPairs);

// Debug to look at generated pairs
// console.log("Generated pairs:");
// console.log(readyPairs);

// ------------------------------------------------

// Inserting data into hash tables

//Linear probing hash table
readyPairs.forEach(([key, value]) => {
    hashTable.insert(key, value);
});

// Pre delete display
console.log("(Linear probing) Displaying hash table:");
console.log("Colliding values are neighboring each other as expected in linear probing.");
hashTable.display();

// RETRIEVE value for key and DELETE key

// console.log(`Retrieved value for key ${readyPairs[0][0]}:`);
console.log(hashTable.get(readyPairs[0][0]));
// console.log(`Value for key ${readyPairs[0][0]} is going to be removed.`)
hashTable.delete(readyPairs[0][0]);

// After delete display
console.log("After removing key:");
hashTable.display();

// ------------------------------------------------
// Quadratic probing hash table
readyPairs.forEach(([key, value]) => {
    quadHashTable.insert(key, value);
});

// Pre delete display
console.log("(Quadratic probing) Displaying hash table:");
quadHashTable.display();

// RETRIEVE value for key and DELETE key
console.log(`Retrieved value for key ${readyPairs[0][0]}:`);
console.log(quadHashTable.get(readyPairs[0][0]));
quadHashTable.delete(readyPairs[0][0]);
console.log("After removing key:");

// After delete display
console.log("After removing key:")
quadHashTable.display();