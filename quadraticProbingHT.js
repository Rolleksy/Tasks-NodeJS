// Hash table with Quadratic Probing as means of
// collision resolution

class QuadHashTable {
    constructor(size) {
        this.size = size;
        this.table = new Array(size);
    }

    hashFunction(str) {
        let hash = 0;
        let multiplier = 39;
        let size = this.size;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * multiplier + str.charCodeAt(i)) % size;
        }
        return hash;
    }

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

    get(key) {
        let index = this.hashFunction(key);
        let i = 0;
        while (this.table[(index + i * i) % this.size] !== undefined) {
            if (this.table[(index + i * i) % this.size].key === key) {
                return this.table[(index + i * i) % this.size].value;
            }
            i++;
            if (i >= this.size) {
                return undefined;
            }
        }
        return undefined;
    }
    delete(key) {
        let index = this.hashFunction(key);
        let i = 0;
        while (this.table[(index + i * i) % this.size] !== undefined) {
            if (this.table[(index + i * i) % this.size].key === key) {
                delete this.table[(index + i * i) % this.size];
                return true;
            }
            i++;
            if (i >= this.size) {
                return false;
            }
        }
        return false;
    }
    display(){
        for (let i = 0; i < this.size; i++) {
            if (this.table[i] !== undefined) {
                console.log(i + ": " + this.table[i].key + " " + this.table[i].value);
            }
        }
    }
}
module.exports = { QuadHashTable };
