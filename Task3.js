function chainPromises(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            reject(new Error('Argument must be an array of promises'));
            return;
        }
        let result = Promise.resolve();
        promises.forEach((promise) => {
            result = result.then(promise);
        });
        result.then(resolve).catch(reject);
    });
}

module.exports = {chainPromises};

// Test

function asyncFunction1() {
  return Promise.resolve("Result from asyncFunction1");
}

function asyncFunction2(data) {
  return Promise.resolve(data + " - Result from asyncFunction2");
}

function asyncFunction3(data) {
  return Promise.resolve(data + " - Result from asyncFunction3");
}

function asyncFunction4() {
  return Promise.reject("Error occurred in asyncFunction4");
}
const functionsArray = [asyncFunction1, asyncFunction2, asyncFunction3];
const functionsArray1 = [asyncFunction1, asyncFunction2, asyncFunction4, asyncFunction3];

chainPromises(functionsArray)
  .then(result => {
    console.log("Chained promise result:", result);
    // Expected: "Result from asyncFunction1 - Result from asyncFunction2 - Result from asyncFunction3"
  })
  .catch(error => {
    console.error("Chained promise error:", error);
  });

chainPromises(functionsArray1)
    .then(result => {
        console.log("Chained promise result:", result);
        // Expected: "Result from asyncFunction1 - Result from asyncFunction2 - Result from asyncFunction3"
    })
    .catch(error => {
        console.error("Chained promise error:", error);
    });
