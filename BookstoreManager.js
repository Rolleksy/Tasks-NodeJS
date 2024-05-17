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
    // Method to simulate a user paying for an order
    async payForOrder(user) {
        try {
            const order = await this.getOrder(user);
            console.log(`Payment completed.`);
            this.processPayment(user);
        } catch (error) {
            console.error(`Error encountered while paying for order: ${error}`);
        }
    }
    // Method to simulate processing a payment - it clears a cart after successful payment
    async processPayment(user) {
        try {
            const total = await this.getTotalCostOfCart(user);
            console.log(`Payment processed for ${user.name}`);
            await this.clearCart(user);
        } catch (error) {
            console.error(`Error processing payment for user ${user.name}: ${error}`);
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
    // Method to search a book
    async searchBooks(query) {
        try {
            const qry = this.db.prepare('SELECT * FROM books WHERE title LIKE ? OR author LIKE ?');
            const books = await new Promise((resolve, reject) => {
                qry.all(`%${query}%`, `%${query}%`, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
            qry.finalize();
            console.log(`Books found for query: ${query}`)
            books.forEach(element => {
                console.log(`Author: ${element.author}, Title: ${element.title}, Price: ${element.price}, is available: ${element.availability ? 'Yes' : 'No'}`)
            });
            return books;
        } catch (error) {
            console.error(`Error searching books: ${error}`);
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
    // Method used to get the last order - used in the applyDiscount method
    async getLastOrder(user) {
        try {
            const qry = this.db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY id DESC LIMIT 1');
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
            return order;
        } catch (error) {
            console.error(`Error getting the latest order: ${error}`);
        }
    }
    // Method to apply a discount to an order
    async applyDiscount(user, percentage) {
        try {
            const order = await this.getLastOrder(user);
            const total = order.total;
            const discount = total * (percentage / 100);
            const newTotal = total - discount;
            console.log(`Discount of ${percentage}% applied to ${user.name}'s order. New total: $${newTotal}`);
            await this.updateOrderTotal(order.id, newTotal);
            return newTotal;
        } catch (error) {
            console.error(`Error applying discount for user ${user.name}: ${error}`);
        }
    }
    // Method to update the total price of an order
    async updateOrderTotal(orderId, newTotal) {
        try {
            const qry = this.db.prepare('UPDATE orders SET total = ? WHERE id = ?');
            qry.run(newTotal, orderId);
            qry.finalize();
            console.log(`Order total price updated to $${newTotal} for order ID ${orderId}`);
        } catch (error) {
            console.error(`Error updating order total price for order ID ${orderId}: ${error}`);
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