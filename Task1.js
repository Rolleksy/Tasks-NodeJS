function calculateDiscountedPrice(products, discount) {
    return products.map(product =>{
        // "...product" is a spread operator to copy the object
        const discountedProduct = {...product};
        discountedProduct.price *= (1 - discount/100);
        return discountedProduct;
    })
    }

function calculateTotalPrice(products) {
    return products.reduce((sum, product) => sum + product.price, 0);
}

// Test - Task 1

const products = [
    { name: "Product 1", price: 50 },
    { name: "Product 2", price: 100 },
    { name: "Product 3", price: 75 }
];

const discount = 10;

const discountedProducts = calculateDiscountedPrice(products, discount);
console.log(discountedProducts);

const totalPrice = calculateTotalPrice(products);
console.log(totalPrice);