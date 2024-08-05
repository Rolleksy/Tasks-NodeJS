const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
dotenv.config();

// Connect to the database

const userDbPath = process.env.USERDB_PATH;
const usersDb = new sqlite3.Database(userDbPath);

const dbPath = process.env.PARTSDB_PATH;
const partsDb = new sqlite3.Database(dbPath);


// Create tables
// users table
usersDb.serialize(() => {
    usersDb.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY, 
        username TEXT, 
        password TEXT
    )`);
});

// parts table
partsDb.serialize(() => {
    partsDb.run(`CREATE TABLE IF NOT EXISTS Parts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        availability INTEGER NOT NULL,
        work_hours INTEGER NOT NULL,
        warehouse_id INTEGER,
        price REAL NOT NULL,
        FOREIGN KEY (warehouse_id) REFERENCES Warehouse(id)
    )`);
});

// warehouse table
partsDb.serialize(()=>{
    partsDb.run(`CREATE TABLE IF NOT EXISTS Warehouse (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        delivery_time INTEGER NOT NULL
    )`);
})

// order table
partsDb.serialize(() => {
    partsDb.run(`CREATE TABLE IF NOT EXISTS Orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_name TEXT NOT NULL,
        order_date TEXT NOT NULL
      )`);
});

// order_parts table
partsDb.serialize(() => {
    partsDb.run(`CREATE TABLE IF NOT EXISTS OrderParts (
        order_id INTEGER NOT NULL,
        part_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        PRIMARY KEY (order_id, part_id),
        FOREIGN KEY (order_id) REFERENCES Orders(id),
        FOREIGN KEY (part_id) REFERENCES Parts(id)
      )`);
})

module.exports = {usersDb, partsDb};
