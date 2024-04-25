const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john.doe@example.com"
  };
  
  Object.getOwnPropertyNames(person).forEach(prop => {
    Object.defineProperty(person, prop, {
      writable: false,
      configurable: false
    });
  });
  
  Object.defineProperty(person, "updateInfo", {
    value: function(newInfo) {
      Object.keys(newInfo).forEach(prop => {
        if (this.hasOwnProperty(prop)) {
          if (Object.getOwnPropertyDescriptor(this, prop).writable === false) {
            this[prop] = newInfo[prop];
          }
        }
      });
    },
    writable: false,
    configurable: false
  });
  
  Object.defineProperty(person, "address", {
    value: {},
    enumerable: false,
    configurable: false,
    writable: true
  });
  
  // Test
  console.log("Before update:");
  console.log(person);
  console.log("=====================================")
  console.log("Descriptor");
  let descriptor = Object.getOwnPropertyDescriptors(person);
  console.log(descriptor);

  console.log("=====================================")
  person.updateInfo({ firstName: "Jane", age: 32, address: { city: "New York" } });
  

  console.log("\nAfter update:");
  console.log(person);
  console.log("=====================================")
  console.log("Descriptor");
  descriptor = Object.getOwnPropertyDescriptors(person);
  console.log(descriptor);