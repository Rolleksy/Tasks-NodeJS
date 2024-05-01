function customShuffle(array) {
    const shuffledArray = [...array];
    let currentIndex = shuffledArray.length;

    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
            shuffledArray[randomIndex],
            shuffledArray[currentIndex]
        ];
    }

    return shuffledArray;
}

module.exports = {customShuffle};

// Test

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const shuffledArray = customShuffle(arr);
console.log(shuffledArray);