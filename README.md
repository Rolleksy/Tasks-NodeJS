# Hash Tables

## Usage:

In order to use hash tables decribed below user need to import them as follows:
`const { LinearHashTable } = require('./linearProbingHT');`
`const { QuadHashTable } = require('./quadraticProbingHT');`

Or use testing file: `hashingTests.js`

## Utilities

In file `utils.js` there are functions for generating test data.
- generateRandomKeys(): Generates random keys
- generateKeysAndValues(numberOfKeys): Generates array with random key-values pairs
- generateCollidingPairs(numberOfPairs, hashTable): Generates array with pairs of random keys and values, and based on `hashTable` and its method `hashFunction` finds different but colliding random key and value pair. Returns array consisting of data with `numberOfTimes` times examples. 

## What is a hash table?

A hash table is a data structure that maps keys to values using a hash function. It offers average-case time complexity of O(1) for insert, delete, and search operations. Hash tables are commonly used for implementing associative arrays, database indexing, and caches.

## Collision resolution used in this project

Collision happens when two keys hash to the same index. 

Techniques used in this project to handle collisions:
- **Linear Probing**: Resolves collision by checking the next available slot.
- **Quadratic Probing**: Resolves collisions using quadratic function to determine next slot.


## Hash function used in both classes:

```Javascript
hashFunction(str) {
    let hash = 0;
    let multiplier = 37;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * multiplier + str.charCodeAt(i)) % this.size;
    }
    return hash;
}
```

Hash function converts a string into a hash value within the bounds of the hash table's size. It uses a multiplier, in this case primary number, to spread out the hash values more uniformly. It iterates over each character in string and retrieves ASCII value.

## Linear Probing - Hash Table (LinearHashTable Class)

**Constructor**(size):
    - creates array of given size - defaults to 50

**Methods**: 
    - hashFunction(str): Calculates the hash value of given string
    - insert(key, value): Inserts a pair of key-value into the hash table using linear probing as collision resolution
    - get(key): Retrieves value associated with given key
    - delete(key): Deletes a key-value pair from hash table
    - display(): Displays contents of the hash table

### How linear probing works?

- If the calculated index is already occupied, the function moves to the next index (index + 1).
- This process repeats until an empty slot is found.

For example Insert key-value pair method:
```Javascript
insert(key, value) {
        let index = this.hashFunction(key);
        while (this.table[index] !== undefined) {
            index = (index + 1) % this.size;
        }
        this.table[index] = { key, value };
    }
```

## Quadratic Probing - Hash Table (QuadHashTable Class)

**Constructor**(size):
    - creates array of given size

**Methods**: 
    - hashFunction(str): Calculates the hash value of given string
    - insert(key, value): Inserts a pair of key-value into the hash table using quadratic probing as collision resolution
    - get(key): Retrieves value associated with given key
    - delete(key): Deletes a key-value pair from hash table
    - display(): Displays contents of the hash table 

### How Quadratic Probing works?

- If the calculated index is occupied, the function checks the index (index + i * i) % this.size, where i starts at 0 and increments by 1 on each collision.
- This quadratic approach (i.e., checking 1, 4, 9, 16, etc., slots away) helps in spreading out the probing sequence.


For example Insert key-value pair method:
```Javascript
insert(key, value) {
        let index = this.hashFunction(key);
        let i = 0;

        while (this.table[(index + i * i) % this.size] !== undefined) {
            i++;
            if (i >= this.size) {
                throw new Error("Hash table is full");
            }
        }

        index = (index + i * i) % this.size;
        this.table[index] = { key, value };
    }
```

## Time Complexity

**Average case time complexity** in both implementations is **O(1)**. Both linear and quadratic probing involve a constant-time operation to calculate the hash value and then a constant-time operation to probe for an empty slot or the target key's slot. As a result, on average, the time taken to insert, retrieve, or delete a key-value pair is constant, regardless of the number of elements already stored in the hash table. 

**Worst case time complexity** in both linear and quadratic implementations is **O(n)**. This occurs when there are many collisions, leading to clustering of keys in contiguous slots. Quadratic probing aim is to reduce clustering compared to linear probing, but with lots of collisions it can still happen.