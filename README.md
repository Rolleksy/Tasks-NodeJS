# Bookstore

## 1. Simple version - file `BookstoreSimple.js`

### Purpose of this project.

This application was created in order to learn and showcase abilities to design and implement object-oriented program in JavaScript. It is supposed to simulate functioning of an online bookstore.

**Classes**

1.1. **Book**

Represents a book available in the bookstore.

    Properties:
        - title (string): Title of the book.
        - author (string): Author of the book.
        - price (number): Price of the book.
        - isbn (string): ISBN (International Standard Book Number) of the book.
        - availability (boolean): Availability status of the book.

    Methods:
        - getTitle(): Returns the title of the book.
        - getAuthor(): Returns the author of the book.
        - getPrice(): Returns the price of the book.
        - getIsbn(): Returns the ISBN of the book.
        - getAvailability(): Returns the availability status of the book.
        - toString(): Displays the details of the book including title, author, price, and ISBN.

1.2. **User**

Represents a user of the bookstore.

    Properties:
        - name (string): Name of the user.
        - email (string): Email address of the user.
        - userId (string): Unique identifier for the user.
        - cart (Cart): User's shopping cart.

    Methods:
        - createCart(): Creates a new cart for the user.
        - createOrder(cart): Creates a new order based on the items in the user's cart.

1.3. **Cart**

Represents the shopping cart of a user.

    Properties:
        - user (User): User associated with the cart.
        - items (array of Book): List of books in the cart.

    Methods:
        - addBook(book): Adds a book to the cart.
        - removeBook(book): Removes a book from the cart.
        - calculateTotalPrice(): Calculates the total price of items in the cart.

1.4. **Order**

Represents an order made by a user.

    Properties:
        - user (User): User who made the order.
        - items (array of Book): List of books in the order.
        - totalPrice (number): Total price of the order.

    Methods:
        - createListFromCart(cart): Creates a list of books from the user's cart.
        - toString(): Displays the ordered items in a concise format.
        - calculateTotalPrice(): Calculates the total price of items in the order.
        - applyDiscount(discountPercentage): Applies a discount to the order based on the given percentage.


### Usage:

- Simulate creating/logging of user account and assign it to `const user1`
`const user1 = new User("Alice", "alice@example.com", "AL123");`
- Simulating creation of books available in bookstore and assign them to `const book`
`const book1 = new Book("The Great Gatsby", "F. Scott Fitzgerald", 15.99, "978075", true);`
- Simulating creation of users cart and assign it to `const userCart`
`const userCart = user1.createCart();`
- Simulating adding books to the cart
`userCart.addBook(book1)`
- Simulating creation of users order and assign it to `const order`
`const order = user1.createOrder(userCart);`
- Simulating applying discount and showing calculated total price

## 2. Bookstore with SQLite Database

**This projects requires SQLite which can be installed with command:**
`npm i sqlite3`

1. Run file `Instances.js` in order to create and populate database.
2. Run file `Main.js` to simulate user activities.

 All data is stored in SQLite based database and can be added, removed or retrieved from it.

### Purpose of this project:


**Classes**

Below classes are in file `Models.js`

2.1. **Bookstore**

Represents a bookstore and handles database operations related to books, users, carts, and orders.

    Constructor:
        - dbFilePath (string): File path to the SQLite database file.
        - booksList (array of objects): List of book objects to be inserted into the database.
        - usersList (array of objects): List of user objects to be inserted into the database.
    Properties:
        - db (sqlite3.Database): SQLite database connection.
    Methods:
        - createBookStoreTables(): Creates database tables for books, users, carts, and orders if they don't exist.
        - fillBooksTable(bookList): Fills the books table with data from the provided book list.
        - fillUsersTable(usersList): Fills the users table with data from the provided user list.

2.2. **Book**

Represents a book in the bookstore.

    Constructor:
        - title (string): Title of the book.
        - author (string): Author of the book.
        - isbn (string): ISBN (International Standard Book Number) of the book.
        - price (number): Price of the book.
        - availability (boolean): Availability status of the book.
    Methods:
        - getBookInfo(): Returns a string containing information about the book including title, author, price, and ISBN.

2.3. **User**

Represents a user of the bookstore.

    Constructor:
        - name (string): Name of the user.
        - email (string): Email address of the user.
        - userId (string): Unique identifier for the user.
    Methods:
        - getUserInfo(): Returns a string containing information about the user including name and email.

2.4. **Cart**

Represents a shopping cart of a user.

    Constructor:
        - user (User): User associated with the cart.
    Attributes:
        - cart (array of Book): List of books in the cart.
    Methods:
        - addBook(book): Adds a book to the cart.
        - removeBook(book): Removes a book from the cart.
        - getCart(): Returns the cart.
        - getTotal(): Calculates and returns the total price of items in the cart.

2.5. **Order**

Represents an order placed by a user.

    Constructor:
        - user (User): User who placed the order.
    Attributes:
        - cart (Cart): Cart associated with the order.
        - total (number): Total price of the order.
    Methods:
        - findUserCart(userId): Finds and returns the cart associated with the given user ID.
        - getTotals(cart): Calculates and returns the total price of items in the cart.
        - getOrderInfo(): Returns a string containing information about the order including user ID and total price.