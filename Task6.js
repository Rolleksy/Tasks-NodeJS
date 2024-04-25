function deepCloneObject(obj, clonedObjects = []) {
  if (obj === null || typeof obj !== 'object') {
      return obj;
  }

  // Check for avoiding infinite recursion
  const alreadyCloned = clonedObjects.find(o => o.original === obj);
  if (alreadyCloned) {
      return alreadyCloned.clone;
  }

  const clonedObj = Array.isArray(obj) ? [] : {};

  clonedObjects.push({ original: obj, clone: clonedObj });

  for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
          // recursively clone the object
          clonedObj[key] = deepCloneObject(obj[key], clonedObjects);
      }
  }
  return clonedObj;
}

// Test 
const originalObject = {
  a: 1,
  b: {
    c: 2,
    d: [3, 4],
    w: {
      x: "test"
    }
  }
};

// adding circular reference
originalObject.circularRef = originalObject;

const clonedObject = deepCloneObject(originalObject);

console.log(clonedObject);