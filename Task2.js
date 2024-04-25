let product = {
    name: "Laptop",
    price: 1000,
    quantity: 5
};

Object.defineProperty(product, "price", {
    enumerable: false,
    writable: false
});

Object.defineProperty(product, "quantity", {
    enumerable: false,
    writable: false
});

function getTotalPrice(product) {
    const priceDescriptor = Object.getOwnPropertyDescriptor(product, "price");
    const quantityDescriptor = Object.getOwnPropertyDescriptor(product, "quantity");

    const totalPrice = priceDescriptor.value * quantityDescriptor.value;
    return totalPrice;
}

function deleteNonConfigurable(obj, propName) {
    if (Object.getOwnPropertyDescriptor(obj, propName).configurable === false) {
        throw new Error("Cannot delete non-configurable property: " + propName);
    }
    else {
        delete obj[propName];
    }
}

// Test
console.log(`Total price of product ${product.name} is: `);
console.log(getTotalPrice(product)); // 5000

// try {
//     deleteNonConfigurable(product, "price");
// }
// catch(error) {
//     console.log(error.message); 
// }

try {
    deleteNonConfigurable(product, "name");
}
catch(error) {
    console.log(error.message);
}
console.log(`After deleting non-configurable property "name":`);
let descriptor = Object.getOwnPropertyDescriptors(product);
console.log(descriptor);