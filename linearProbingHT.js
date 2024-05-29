// Hash table with Linear Probing as means of 
// collision resolution

class LinearHashTable {
    constructor(size = 50) {
        this.table = new Array(size);
        this.size = size;
    }

    hashFunction(str) {
        let hash = 0;
        let multiplier = 37;
        let size = this.size;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * multiplier + str.charCodeAt(i)) % size;
        }
        return hash;
    }
  
    insert(key, value) {
        let index = this.hashFunction(key);
        while (this.table[index] !== undefined) {
            index = (index + 1) % this.size;
        }
        this.table[index] = { key, value };
    }
  
    get(key) {
        let index = this.hashFunction(key);
        while (this.table[index] !== undefined) {
            if (this.table[index].key === key) {
                return this.table[index].value;
            }
            index = (index + 1) % this.size;
        }
        return undefined;
    }

    delete(key) {
        let index = this.hashFunction(key);
        while (this.table[index] !== undefined) {
            if (this.table[index].key === key) {
                delete this.table[index];
                return true;
            }
            index = (index + 1) % this.size;
        }
        return false;
    }

    display() {
        for (let i = 0; i < this.size; i++) {
            if (this.table[i] !== undefined) {
                console.log(i + ": " + this.table[i].key + " " + this.table[i].value);
            }
        }
    }
}

module.exports = { LinearHashTable };


