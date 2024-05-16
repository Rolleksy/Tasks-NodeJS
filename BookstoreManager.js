const {
    Book,
    User,
    Cart,
    Order
} = require('./Models.js');

class BookstoreManager {
    constructor(database) {
        this.db = database;
    }

    // USER METHODS
    // Methods to add and remove users and books
    async addUser(user) {
        try {
            const qry = this.db.prepare('INSERT INTO users (userId, name, email) VALUES (?, ?, ?)');
            qry.run(user.userId, user.name, user.email);
            qry.finalize();
            console.log(`User ${user.name} added to the database!`);
        } catch (error) {
            console.error(`Error adding user ${user.name} to the database: ${error}`);
        }
    }
    async removeUser(user) {
        try {
            const qry = this.db.prepare('DELETE FROM users WHERE userId = ?');
            qry.run(user.userId);
            qry.finalize();
            console.log(`User ${user.name} removed from the database!`);
        } catch (error) {
            console.error(`Error removing user ${user.name} from the database: ${error}`);
        }
    }
    // -----------------------------------------------------
    // BOOK METHODS
    // Methods to add and remove books
    async addBook(book) {
        try {
            const qry = this.db.prepare('INSERT INTO books (title, author, isbn, price, availability) VALUES (?, ?, ?, ?, ?)');
            qry.run(book.title, book.author, book.isbn, book.price, book.availability);
            qry.finalize();
            console.log(`Book ${book.title} added to the database!`);
        } catch (error) {
            console.error(`Error adding book ${book.title} to the database: ${error}`);
        }
    }

    // Method to remove a book
    async removeBook(book) {
        try {
            const qry = this.db.prepare('DELETE FROM books WHERE isbn = ?');
            qry.run(book.isbn);
            qry.finalize();
            console.log(`Book ${book.title} removed from the database!`);
        } catch (error) {
            console.error(`Error removing book ${book.title} from the database: ${error}`);
        }
    }

    // Method to get a book by its id - Used in the getCart method
    async getBookById(id) {
        try {
            const qry = this.db.prepare('SELECT * FROM books WHERE id = ?');
            const book = await new Promise((resolve, reject) => {
                qry.get(id, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
            qry.finalize();
            return book;
        } catch (error) {
            console.error(`Error getting book by id: ${error}`);
        }
    }

    // -----------------------------------------------------
    // CART METHODS
    // Method to add a book to the cart, given a user and a book
    async addBookToCart(user, book) {
        try {
            const qry = this.db.prepare('INSERT INTO carts (userId, bookId) VALUES (?, ?)');
            qry.run(user.userId, book.id);
            qry.finalize();
            console.log(`Book ${book.title} added to ${user.name}'s cart!`);
        } catch (error) {
            console.error(`Error adding book ${book.title} to ${user.name}'s cart: ${error}`);
        }
    }

    // Method to remove a book from the cart, given a user and an cart item id
    async removeBookFromCart(user, id) {
        try {
            const qry = this.db.prepare('DELETE FROM carts WHERE userId = ? AND id = ?');
            qry.run(user.userId, id);
            qry.finalize();
            console.log(`Book ${id} removed from ${user.name}'s cart!`);
        } catch (error) {
            console.error(`Error removing book ${id} from ${user.name}'s cart: ${error}`);
        }
    }
    // Method to get the cart
    async getCart(user) {
        try {
            const qry = this.db.prepare('SELECT * FROM carts WHERE userId = ?');
            const cartData = await new Promise((resolve, reject) => {
                qry.all(user.userId, async (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        const userCart = new Cart(user);
                        for (const row of rows) {
                            const book = await this.getBookById(row.bookId);
                            if (book) {
                                userCart.cart.push(new Book(book.title, book.author, book.isbn, book.price, book.availability)); // Dodawanie książki do koszyka
                            }
                        }
                        resolve(userCart);
                    }
                });
            });
            qry.finalize();
            return cartData;
        } catch (error) {
            console.error(`Error getting ${user.name}'s cart: ${error}`);
        }
    }
    // Method to get the total cost of the cart
    async getTotalCostOfCart(user) {
        try {
            const cart = await this.getCart(user);
            let totalCost = 0;
            for (const item of cart.cart) {
                totalCost += item.price;
            }
            return totalCost;
        } catch (error) {
            console.error(`Error calculating total cost of cart for user ${user.name}: ${error}`);
        }
    }

    // Method to clear the cart
    async clearCart(user) {
        try {
            const qry = this.db.prepare('DELETE FROM carts WHERE userId = ?');
            qry.run(user.userId);
            qry.finalize();
            console.log(`Cart cleared for ${user.name}`);
        } catch (error) {
            console.error(`Error clearing cart for ${user.name}: ${error}`);
        }
    }

    // -----------------------------------------------------
    // ORDER METHODS
    // Method to create an order
    async createOrder(user) {
        try {
            const qry = this.db.prepare('INSERT INTO orders (userId, items, total) VALUES (? ,?, ?)');
            const cartItems = await this.getCart(user);
            const titles = cartItems.cart.map((book) => book.title).join(', ');
            const total = await this.getTotalCostOfCart(user);
            qry.run(user.userId, titles, total);
            qry.finalize();
            console.log(`Order created for ${user.name}`);
            console.log(`Items: ${titles}`);
            console.log(`Total: $${total}`);
        } catch (error) {
            console.error(`Error creating order for user ${user.name}: ${error}`);
        }
    }
    // Method to get the order
    async getOrder(user) {
        try {
            const qry = this.db.prepare('SELECT * FROM orders WHERE userId = ?');
            const order = await new Promise((resolve, reject) => {
                qry.get(user.userId, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
            qry.finalize();
            console.log(`Order retrieved for ${user.name}`);
            return order;
        } catch (error) {
            console.error(`Error getting order for user ${user.name}: ${error}`);
        }
    }

    // -----------------------------------------------------
    // SIMULATION METHODS
    // Method to get the active user - Simulating a logged in user
    async setActiveUser(userId) {
        try {
            const qry = this.db.prepare('SELECT * FROM users WHERE userId = ?');
            const user = await new Promise((resolve, reject) => {
                qry.get(userId, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
            qry.finalize();
            console.log(`Active user set to ${user.name}`);
            return user;
        } catch (error) {
            console.error(`Error setting active user: ${error}`);
        }
    }
    // Method to set the selected book - Simulating a user selecting a book
    async setSelectedBook(isbn) {
        try {
            const qry = this.db.prepare('SELECT * FROM books WHERE isbn = ?');
            const book = await new Promise((resolve, reject) => {
                qry.get(isbn, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
            qry.finalize();
            console.log(`Selected book set to ${book.title}`);
            return book;
        } catch (error) {
            console.error(`Error setting selected book: ${error}`);
        }
    }

}

module.exports = {
    BookstoreManager
};