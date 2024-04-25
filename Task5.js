function observeObject(obj, callback) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      callback(property, 'get');
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      callback(property, 'set');
      return Reflect.set(target, property, value, receiver);
    }
  });
}

const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  email: "john.doe@example.com"
};

// Callback function for logging actions
function callback(property, action) {
  console.log(`Property "${property}" ${action === 'get' ? 'was accessed by get' : 'was set'}.`);
}

const observedPerson = observeObject(person, callback);

console.log(observedPerson.firstName); // Getting "Property "firstName" was accessed."
console.log(observedPerson.age); // Getting "Property "age" was accessed."

observedPerson.age = 35; // Setting "Property "age" was set."
