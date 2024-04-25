function createImmutableObject(obj) {
    const immutableObj = {};
  
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // recursively make the property read-only and non-writable if property is an object or array
        immutableObj[key] = createImmutableObject(obj[key]);
      } else {
        // making property read-only and non-writable by defineProperty
        Object.defineProperty(immutableObj, key, {
          value: obj[key],
          writable: false,
          enumerable: true,
          configurable: false
        });
      }
    });
  
    return immutableObj;
  }
  
  // Test the function with the person object from Task 1
  const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@example.com"
  };
  
  const immutablePerson = createImmutableObject(person);
  console.log(immutablePerson);
 
  immutablePerson.firstName = "Jane";
  console.log(immutablePerson.firstName); // Output: John
  