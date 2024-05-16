const sqlite3 = require('sqlite3').verbose();

// Creating models for Bookstore, Book, User, Cart, and Order

class Bookstore {
    constructor(dbFilePath, booksList, usersList) {
        // Connecting to DB
        this.db = new sqlite3.Database(dbFilePath);
        // Creating tables and filling them with data
        this.createBookStoreTables();
        this.fillBooksTable(booksList);
        this.fillUsersTable(usersList);
    }

    // Method to create tables in the database
    createBookStoreTables(){
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY,
                title TEXT,
                author TEXT,
                isbn TEXT,
                price REAL,
                availability INTEGER
            )`);
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                userId TEXT PRIMARY KEY,
                name TEXT,
                email TEXT
            )`);
            this.db.run(`CREATE TABLE IF NOT EXISTS carts (
                id INTEGER PRIMARY KEY,
                userId TEXT,
                bookId INTEGER,
                FOREIGN KEY (userId) REFERENCES users(userId),
                FOREIGN KEY (bookId) REFERENCES books(id)
            )`);
            
            this.db.run(`CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY,
                userId TEXT,
                items TEXT,
                total REAL,
                FOREIGN KEY (userId) REFERENCES users(userId)
            )`);
        });}
        // Method to fill books table with data
        fillBooksTable(bookList){
            const stmt = this.db.prepare('INSERT INTO books (title, author, isbn, price, availability) VALUES (?, ?, ?, ?, ?)');
            bookList.forEach((book) => {
                stmt.run(book.title, book.author, book.isbn, book.price, book.availability);
            });
            stmt.finalize();
        };
        // Method to fill users table with data
        fillUsersTable(usersList){
            const stmt = this.db.prepare('INSERT INTO users (userId, name, email) VALUES (?, ?, ?)');
            usersList.forEach((user) => {
                stmt.run(user.userId, user.name, user.email);
            });
            stmt.finalize();
        }
    }

// Book class model
class Book {
    constructor(title, author, isbn, price, availability) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.price = price;
        this.availability = availability;
    }
    // Method to display book details
    getBookInfo() {
        return `${this.title} by ${this.author} is available for $${this.price}. ISBN: ${this.isbn}`;
    }
}
// User class model
class User {
    constructor(name, email, userId) {
        this.name = name;
        this.email = email;
        this.userId = userId;
    }
    // Method to display user details
    getUserInfo() {
        return `${this.name} has an account under ${this.email}`;
    }
}
// Cart class model
class Cart {
    constructor(user) {
        this.user = user;
        this.cart = [];
    }
}
// Order class model
class Order {
    constructor(user) {
        this.user = user;
        this.cart = findUserCart(user.userId);
        this.total = this.getTotals(this.cart);
    }
    // Method to display order details
    getOrderInfo() {
        return `Order placed by ${this.userId} for $${this.total}`;
    }
}

module.exports = { Bookstore, Book, User, Cart, Order };
