function validateObject(obj, schema) {
    for (let propName in schema) {
      if (schema.hasOwnProperty(propName)) {
        // if prop is missing and it is required
        if (schema[propName].required && !(propName in obj)) {
          return false;
        }
        // if prop is of different type
        if (propName in obj && typeof obj[propName] !== schema[propName].type) {
          return false;
        }
        if (schema[propName].validate && !schema[propName].validate(obj[propName])) {
          return false;
        }
      }
    }
    return true;
  }
  
  // Test
  const obj = {
    name: "Jan",
    age: 36,
    email: "jan@example.com"
  };

  const obj2 = {
    name: "Marek",
    age: "twenty",
    email: "wrongemail.com"
  }
  
  const schema = {
    name: { type: 'string', required: true },
    age: { type: 'number', required: true },
    email: {
      type: 'string',
      required: true,
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }
  };
  

  console.log(validateObject(obj, schema)); // Output: true
  console.log(validateObject(obj2, schema)); // Output: false