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
        order_date TEXT NOT NULL,
        total_cost REAL NOT NULL,
        labor_cost REAL NOT NULL,
        total_time INTEGER NOT NULL,
        ETADelivery TEXT NOT NULL
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

// Seed data - example data for the Parts and Warehouse tables
const seedData = async () => {
    const warehouses = [
        { name: 'Warehouse A', delivery_time: 24 },
        { name: 'Warehouse B', delivery_time: 48 }
    ];

    const parts = [
        { name: 'Brake Pads', availability: 10, work_hours: 4, warehouse_id: 1, price: 100.0 },
        { name: 'Oil Filter', availability: 20, work_hours: 1, warehouse_id: 2, price: 25.0 },
        { name: 'Air Filter', availability: 15, work_hours: 1, warehouse_id: 1, price: 30.0 },
        { name: 'Spark Plugs', availability: 30, work_hours: 2, warehouse_id: 2, price: 50.0 }
    ];

    return new Promise((resolve, reject) => {
        // Insert warehouses
        warehouses.forEach((warehouse) => {
            partsDb.run(
                `INSERT INTO Warehouse (name, delivery_time) VALUES (?, ?)`,
                [warehouse.name, warehouse.delivery_time],
                (err) => {
                    if (err) {
                        console.error(`Error seeding warehouse: ${err.message}`);
                        reject(err);
                    }
                }
            );
        });

        // Insert parts
        parts.forEach((part) => {
            partsDb.run(
                `INSERT INTO Parts (name, availability, work_hours, warehouse_id, price) VALUES (?, ?, ?, ?, ?)`,
                [part.name, part.availability, part.work_hours, part.warehouse_id, part.price],
                (err) => {
                    if (err) {
                        console.error(`Error seeding parts: ${err.message}`);
                        reject(err);
                    }
                }
            );
        });

        resolve();
    });
};

// Check if both Parts and Warehouse tables are empty
const checkIfDbIsEmpty = () => {
    return new Promise((resolve, reject) => {
        partsDb.get('SELECT COUNT(*) as count FROM Parts', [], (err, partsRow) => {
            if (err) {
                reject(err);
            } else {
                partsDb.get('SELECT COUNT(*) as count FROM Warehouse', [], (err, warehouseRow) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Resolve true if both tables are empty
                        resolve(partsRow.count === 0 && warehouseRow.count === 0);
                    }
                });
            }
        });
    });
};

const seedExampleDatabase = async () => {
    try {
        const isDbEmpty = await checkIfDbIsEmpty();
        if (isDbEmpty) {
            await seedData();
        }
    } catch (error) {
        console.error('Error during database seeding:', error);
    }
};

// Seed the database
seedExampleDatabase();

module.exports = {usersDb, partsDb};
