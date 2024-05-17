// Book class model
class Book {
    constructor(title, author, price, isbn, availability) {
        this.title = title;
        this.author = author;
        this.price = price;
        this.isbn = isbn;
        this.availability = availability;
    }

    // Getter methods
    getTitle() {
        return this.title;
    }

    getAuthor() {
        return this.author;
    }

    getPrice() {
        return this.price;
    }

    getIsbn() {
        return this.isbn;
    }
    getAvailability() {
        return this.availability;
    }

    // Method to display book details
    toString() {
        console.log(`${this.title} by ${this.author} - $${this.price}. ISBN: ${this.isbn}`);
    }
}
// Subclass of Book - PaperBook
class PaperBook extends Book {
    constructor(title, author, price, isbn, availability, pageNumber) {
        super(title, author, price, isbn, availability);
        this.pageNumber = pageNumber;
    }
    getPageNumber() {
        return this.pageNumber;
    }
    toString(){
        console.log(`This is ${this.constructor.name} version of: ${this.title} by ${this.author} - $${this.price}. ISBN: ${this.isbn}, Pages: ${this.pageNumber}`);
    }
}

// Subclass of Book - ElectronicBook
class ElectronicBook extends Book {
    constructor(title, author, price, isbn, availability, format) {
        super(title, author, price, isbn, availability);
        this.format = format;
    }
    getFormat() {
        return this.format;
    }
    toString(){
        console.log(`This is ${this.constructor.name} version of: ${this.title} by ${this.author} - $${this.price}. ISBN: ${this.isbn}, Format: ${this.format}`);
    
    }
}
// User class model
class User {
    constructor(name, email, userId) {
        this.name = name;
        this.email = email;
        this.userId = userId;
        this.cart = this.createCart();
    }
    // Method to create a cart for the user
    createCart() {
        return new Cart(this);
    }

    // Method to create an order for the user
    createOrder(cart) {
        if (cart.items.length === 0) {
            console.log("Cart is empty. Add something to cart first.");
            return;
        }
        return new Order(this, cart);
    }
}

// Cart class model
class Cart {
    constructor(user) {
        this.user = user;
        this.items = [];
    }

    // Method to add a book to the cart
    addBook(book) {
        console.log(`Added a ${book.constructor.name} version of a book ${book.title} to the cart!`)
        this.items.push(book);
    }

    // Method to remove a book from the cart
    removeBook(book) {
        console.log(`Removed a ${book.constructor.name} book ${book.title} from the cart!`)
        const index = this.items.indexOf(book);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    // Method to calculate total price of items in the cart
    calculateTotalPrice() {
        return this.items.reduce((total, book) => total + book.getPrice(), 0);
    }
}

// Order class model

class Order {
    constructor(user, cart) {
        this.user = user;
        this.items = this.createListFromCart(cart);
        this.totalPrice = cart.calculateTotalPrice();
    }

    // Method to create a list of books from the cart
    createListFromCart(cart) {
        return cart.items.slice();
    }
    // Method to display ordered items in concise format
    toString() {
        return this.items.map(item => `${item.title} by ${item.author} - $${item.price}`).join("\n");
    }

    // Method to apply a discount to the order, percentage is passed as an argument
    applyDiscount(discountPercentage) {
        if (discountPercentage < 0 || discountPercentage > 100) {
            console.log("Invalid discount percentage.");
            return;
        }
        const discountAmount = (this.totalPrice * discountPercentage) / 100;
        this.totalPrice -= discountAmount;
    }
}

module.exports = { Book, User, Cart, Order };

// Test - Simulating user interacting with the bookstore

// Creating instances of books and a user
const book1 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 15.99, "978075", true);
const book2 = new Book("To Kill a Mockingbird", "Harper Lee", 12.99, "978006", true);
const book3 = new PaperBook("1984", "George Orwell", 14.99, "978045", true, 328);
const book4 = new ElectronicBook("Pride and Prejudice", "Jane Austen", 9.99, "978014", true, "PDF");

const user1 = new User("Alice", "alice@example.com", "AL123");

// Creating a cart using the user instance method
console.log("Logging in...\n")
const userCart = user1.createCart();
// Adding books to the cart
console.log("Adding books to the cart...\n");
userCart.addBook(book1);
userCart.addBook(book2);
userCart.addBook(book3);
userCart.addBook(book4);

// Showing total price of items in the cart
console.log("Displaying cart items...\n");
console.log("Cart Total:", userCart.calculateTotalPrice());

// Creating an order using the user instance method
console.log("Creating an order...\n");
const order = user1.createOrder(userCart);

// Displaying ordered items and total price
console.log("Displaying order items...\n");
const orderItems = order.toString();
console.log(orderItems);
console.log("Order Total:", order.totalPrice);

// Applying a discount to the order
console.log("Applying discount...\n");
order.applyDiscount(10);
console.log("Order Total after 10% discount:", order.totalPrice);