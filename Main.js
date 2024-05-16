const sqlite3 = require('sqlite3').verbose();
const { User, Book, Cart, Order} = require('./Models.js');
const BookstoreManager = require('./BookstoreManager.js');

const dbPath = './bookstore.db';
const db = new sqlite3.Database(dbPath);

const bookstoreManager = new BookstoreManager.BookstoreManager(db);


// Simulating users interacting with the bookstore with DB
(async () => {
    try {
        // >>> Simulating setting active user
        const activeUser = await bookstoreManager.setActiveUser('JD123');
        console.log(`${activeUser.name} is now logged in`);

        // Setting second user - for testing purposes
        const secondUser = await bookstoreManager.setActiveUser('JS456');
        console.log(`${secondUser.name} is now logged in`);
        // -----------------------------------------------------
        // >>> Simulating selecting books
        const selectedBook = await bookstoreManager.setSelectedBook('9780060935467');
        // console.log(selectedBook);
        const selectedBook2 = await bookstoreManager.setSelectedBook('9780451524935');
        const selectedBook3 = await bookstoreManager.setSelectedBook('9780590353427');
        const selectedBook4 = await bookstoreManager.setSelectedBook('9780316769488');
        // -----------------------------------------------------
        // >>> Simulating adding books to cart
        // await bookstoreManager.addBookToCart(activeUser, selectedBook);
        // await bookstoreManager.addBookToCart(activeUser, selectedBook2);
        // await bookstoreManager.addBookToCart(activeUser, selectedBook3);
        // await bookstoreManager.addBookToCart(activeUser, selectedBook4);

        // // >>> Simulating second user adding books to cart
        // await bookstoreManager.addBookToCart(secondUser, selectedBook);
        // await bookstoreManager.addBookToCart(secondUser, selectedBook2);
        // -----------------------------------------------------
        // >>> Simulating removing book from a cart - second parameter is the id of element in the cart, not the book id
        // await bookstoreManager.removeBookFromCart(activeUser, 1);
        // -----------------------------------------------------
        // >>> Simulating retrieving information about current items in cart for active user - info as is in db
        // const cart = await bookstoreManager.getCart(activeUser);
        // console.log(cart);
        // const secondCart = await bookstoreManager.getCart(secondUser);
        // console.log(secondCart);
        // -----------------------------------------------------
        // >>> Simulating retrieving all information about books in cart
        // const visualCart = await bookstoreManager.getCartVisual(activeUser);
        // console.log(visualCart);
        // const secondVisualCart = await bookstoreManager.getCartVisual(secondUser);
        // console.log(secondVisualCart);
        // -----------------------------------------------------
        // >>> Simulating getting total cost of cart
        // const total = await bookstoreManager.getTotalCostOfCart(activeUser);
        // console.log(total);
        // const secondTotal = await bookstoreManager.getTotalCostOfCart(secondUser);
        // console.log(secondTotal);
        // -----------------------------------------------------
        // >>> Clearing cart - debugging purposes
        // await bookstoreManager.clearCart(activeUser);
        // -----------------------------------------------------
        // >>> Simulating placing an order
        // await bookstoreManager.createOrder(activeUser);
        // -----------------------------------------------------
        // >>> Simulating getting all orders for user
        // const orders = await bookstoreManager.getOrder(activeUser);
        // console.log(orders);
    } catch (error) {
        console.error(error);
    }

    
})();


// Simulating users interacting with the bookstore without DB
// const users = User[];
// const books = Book[];
