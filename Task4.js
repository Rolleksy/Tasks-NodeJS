function promisify(func) {
    return function() {
        return new Promise((resolve, reject) => {
            func(...arguments, (erro, result) => {
                if (erro) {
                    reject(erro);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

module.exports = { promisify };

// Test

function callbackStyleFunction(value, callback) {
  setTimeout(() => {
    if (value > 0) {
      callback(null, value * 2);
    } else {
      callback("Invalid value", null);
    }
  }, 1000);
}

const promisedFunction = promisify(callbackStyleFunction);

promisedFunction(3)
  .then(result => {
    console.log("Promised function result:", result); // Expected: 6
  })
  .catch(error => {
    console.error("Promised function error:", error);
  });


  function callbackStyleFunctionWithError(callback) {
    setTimeout(() => {
        callback("Something went wrong.", null);
    }, 1000);
}

const promisedFunctionWithError = promisify(callbackStyleFunctionWithError);
promisedFunctionWithError()
    .then(result => {
        console.log("Promised function result:", result);
    })
    .catch(error => {
        console.error("Promised function error:", error); // Spodziewany wynik: "An error occurred"
    });