function promiseAllSettled(promises) {
  return new Promise((resolve) => {
    if (!Array.isArray(promises)) {
        reject(new Error('Argument must be an array of promises'));
        return;
    }

    const results = [];
    let counter = 0;

    promises.forEach((promise, index) => {
      promise
        .then((value) => {
          results[index] = { status: 'fulfilled', value };
        })
        .catch((reason) => {
          results[index] = { status: 'rejected', reason };
        })
        .finally(() => {
          counter += 1;
          if (counter === promises.length) {
            resolve(results);
          }
        });
    });
  });
}

module.exports = { promiseAllSettled };

// Test


const promises = [
  Promise.resolve(1),
  Promise.reject("Error occurred"),
  Promise.resolve(3)
];

promiseAllSettled(promises)
  .then(results => {
    console.log("All promises settled:", results);
    // Expected: [{ status: 'fulfilled', value: 1 },
    //            { status: 'rejected', reason: 'Error occurred' },
    //            { status: 'fulfilled', value: 3 }]
  });

