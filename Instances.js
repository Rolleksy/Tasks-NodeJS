const { User, Book, Cart, Order, Bookstore} = require('./Models.js');

// Instantiating models

// Instancing books
const book1 = new Book('To Kill a Mockingbird', 'Harper Lee', '9780060935467', 9.99, true);
const book2 = new Book('1984', 'George Orwell', '9780451524935', 11.99, true);
const book3 = new Book('Harry Potter and the Sorcerer\'s Stone', 'J.K. Rowling', '9780590353427', 7.99, true);
const book4 = new Book('The Catcher in the Rye', 'J.D. Salinger', '9780316769488', 8.99, true);
const book5 = new Book('Pride and Prejudice', 'Jane Austen', '9780141439518', 5.99, true);
const book6 = new Book('The Hobbit', 'J.R.R. Tolkien', '9780547928227', 12.99, true);

const bookList = [book1, book2, book3, book4, book5, book6];
// Instancing users
const user1 = new User('John Doe', 'john.doe@example.com', 'JD123'); 
const user2 = new User('Jane Smith', 'jane.smith@example.com', 'JS456'); 
const user3 = new User('Mike Johnson', 'mike.johnson@example.com', 'MJ789'); 
const user4 = new User('Emily Davis', 'emily.davis@example.com', 'ED012'); 
const user5 = new User('David Wilson', 'david.wilson@example.com', 'DW345');

const userList = [user1, user2, user3, user4, user5];


const dbPath = './bookstore.db';
const bookstore = new Bookstore(dbPath, bookList, userList);




