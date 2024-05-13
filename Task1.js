function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            reject(new Error('Argument must be an array of promises'));
            return;
        }
        let results = [];
        let pending = promises.length;
        if (promises.length === 0) {
            resolve(results);
        }
        promises.forEach((promise, index) => {
            promise.then((result) => {
                results[index] = result;
                pending -= 1;
                if (pending === 0) {
                resolve(results);
                }
        })
        .catch((error) => {
            reject(error);
        });
        });
    });
}

module.exports = {promiseAll};

// Test

const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.resolve(3)
];

const promises1 = [
    Promise.resolve(1),
    Promise.reject('Błąd! Nie można uzyskać dostępu do zasobu.'),
    Promise.resolve(3),
];

promiseAll(promises)
  .then(results => {
    console.log("All promises resolved:", results); // Expected: [1, 2, 3]
  })
  .catch(error => {
    console.error("At least one promise rejected:", error);
  });


promiseAll(promises1).then(results => {
    console.log("All promises resolved:", results); // Expected: [1, 2, 3]
  })
  .catch(error => {
    console.error("At least one promise rejected:", error);
  });



