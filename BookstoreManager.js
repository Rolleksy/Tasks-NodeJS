class BookstoreManager {
    constructor(database) {
        this.db = database;
    }

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
            console.log(`Book ${book.title} removed from ${user.name}'s cart!`);
        } catch (error) {
            console.error(`Error removing book ${book.title} from ${user.name}'s cart: ${error}`);
        }
    }
    // Method to get the cart
    async getCart(user) {
        try {
            const qry = this.db.prepare('SELECT * FROM carts WHERE userId = ?');
            const cart = await new Promise((resolve, reject) => {
                qry.all(user.userId, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
            qry.finalize();
            return cart;
        } catch (error) {
            console.error(`Error getting ${user.name}'s cart: ${error}`);
        }
    }
    // Method to get the cart visual - Simulating a user viewing their cart
    async getCartVisual(user) {
        try {
            const cart = await this.getCart(user);
            const cartVisual = [];
    
            for (const item of cart) {
                const book = await this.getBookById(item.bookId);
                cartVisual.push(book);
            }
            console.log(`List of books in ${user.name}'s cart:`);
            return cartVisual;
    }
    catch (error) {
        console.error(`Error getting cart visual for user ${user.name}: ${error}`);
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
            return book;
        } catch (error) {
            console.error(`Error setting selected book: ${error}`);
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
    // Method to get the total cost of the cart
    async getTotalCostOfCart(user) {
        try {
            const cart = await this.getCart(user);
            let totalCost = 0;
    
            for (const item of cart) {
                const book = await this.getBookById(item.bookId);
                totalCost += book.price;
            }
    
            return totalCost;
        } catch (error) {
            console.error(`Error calculating total cost of cart for user ${user.name}: ${error}`);
        }
    }
    async createOrder(user) {
        try {
            const qry = this.db.prepare('INSERT INTO orders (userId, items, total) VALUES (? ,?, ?)');
            const items = await this.getCartVisual(user);
            const titles = items.map((book) => book.title).join(', ');
            const total = await this.getTotalCostOfCart(user);
            qry.run(user.userId, titles, total);
            qry.finalize();
            console.log(`Order created for ${user.name}`);
        } catch (error) {
            console.error(`Error creating order for user ${user.name}: ${error}`);
        }
    }

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
            return order;
        } catch (error) {
            console.error(`Error getting order for user ${user.name}: ${error}`);
        }
    }

}

module.exports = {BookstoreManager};