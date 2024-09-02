"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Database {
    constructor() {
        const { USERDB_PATH, PARTDB_PATH } = process.env;
        if (!USERDB_PATH || !PARTDB_PATH) {
            throw new Error("Database paths not provided");
        }
        this.usersDb = new sqlite3_1.default.Database(USERDB_PATH);
        this.partsDb = new sqlite3_1.default.Database(PARTDB_PATH);
        this.initializeDatabase();
    }
    initializeDatabase() {
        // Table creation
        this.usersDb.serialize(() => {
            this.usersDb.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT,
                password TEXT
            )`);
        });
        this.partsDb.serialize(() => {
            this.partsDb.run(`CREATE TABLE IF NOT EXISTS Parts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          availability INTEGER NOT NULL,
          work_hours INTEGER NOT NULL,
          warehouse_id INTEGER,
          price REAL NOT NULL,
          FOREIGN KEY (warehouse_id) REFERENCES Warehouse(id)
        )`);
            this.partsDb.run(`CREATE TABLE IF NOT EXISTS Warehouse (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          delivery_time INTEGER NOT NULL
        )`);
            this.partsDb.run(`CREATE TABLE IF NOT EXISTS Orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          client_name TEXT NOT NULL,
          order_date TEXT NOT NULL,
          total_cost REAL NOT NULL,
          labor_cost REAL NOT NULL,
          total_time INTEGER NOT NULL,
          ETADelivery TEXT NOT NULL
        )`);
            this.partsDb.run(`CREATE TABLE IF NOT EXISTS OrderParts (
          order_id INTEGER NOT NULL,
          part_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL,
          PRIMARY KEY (order_id, part_id),
          FOREIGN KEY (order_id) REFERENCES Orders(id),
          FOREIGN KEY (part_id) REFERENCES Parts(id)
        )`);
        });
    }
    seedData() {
        return __awaiter(this, void 0, void 0, function* () {
            const warehouses = [
                { name: "Warehouse A", delivery_time: 24 },
                { name: "Warehouse B", delivery_time: 48 }
            ];
            const parts = [
                { name: 'Brake Pads', availability: 10, work_hours: 4, warehouse_id: 1, price: 100.0 },
                { name: 'Oil Filter', availability: 20, work_hours: 1, warehouse_id: 2, price: 25.0 },
                { name: 'Air Filter', availability: 15, work_hours: 1, warehouse_id: 1, price: 30.0 },
                { name: 'Spark Plugs', availability: 30, work_hours: 2, warehouse_id: 2, price: 50.0 }
            ];
            return new Promise((resolve, reject) => {
                warehouses.forEach((warehouse) => {
                    this.partsDb.run(`INSERT INTO Warehouse (name, delivery_time) VALUES (?, ?)`, [warehouse.name, warehouse.delivery_time], (err) => {
                        if (err) {
                            console.error(`Error inserting warehouse ${err.message}`);
                            reject(err);
                        }
                    });
                });
                parts.forEach((part) => {
                    this.partsDb.run(`INSERT INTO Parts (name, availability, work_hours, warehouse_id, price) VALUES (?, ?, ?, ?, ?)`, [part.name, part.availability, part.work_hours, part.warehouse_id, part.price], (err) => {
                        if (err) {
                            console.error(`Error inserting part ${err.message}`);
                            reject(err);
                        }
                    });
                });
                resolve();
            });
        });
    }
    checkIfDbIsEmpty() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.partsDb.get('SELECT COUNT(*) as count FROM Parts', [], (err, partsRow) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        this.partsDb.get('SELECT COUNT(*) as count FROM Warehouse', [], (err, warehouseRow) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(partsRow.count === 0 && warehouseRow.count === 0);
                            }
                        });
                    }
                });
            });
        });
    }
    seedExampleDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isEmpty = yield this.checkIfDbIsEmpty();
                if (isEmpty) {
                    yield this.seedData();
                }
            }
            catch (error) { // added any to error to fix error
                console.error(`Error seeding database: ${error.message}`);
            }
        });
    }
    getUsersDb() {
        return this.usersDb;
    }
    getPartsDb() {
        return this.partsDb;
    }
}
const database = new Database();
exports.database = database;
database.seedExampleDatabase();
