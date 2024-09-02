import sqlite3, { Database as SQLiteDatabase, RunResult } from 'sqlite3';
import dotenv from 'dotenv';
import {IDatabase} from './Idatabase'; 

dotenv.config();

interface Warehouse {
    name: string;
    delivery_time: number;
}

interface Part {
    name: string;
    availability: number;
    work_hours: number;
    warehouse_id: number;
    price: number;
}

export default class Database implements IDatabase {
    private static instance: Database;

    private usersDb: SQLiteDatabase;
    private partsDb: SQLiteDatabase;

    private constructor(inMemory: boolean = false) {
        if (inMemory) {
            this.usersDb = new sqlite3.Database(':memory:');
            this.partsDb = new sqlite3.Database(':memory:');
        } else {
            const USERDB_PATH = process.env.USERDB_PATH;
            const PARTDB_PATH = process.env.PARTDB_PATH;
            if (!USERDB_PATH || !PARTDB_PATH) {
                throw new Error('Database paths not provided');
            }
            this.usersDb = new sqlite3.Database(USERDB_PATH);
            this.partsDb = new sqlite3.Database(PARTDB_PATH);
        }
        this.initializeDatabase();
        this.seedExampleDatabase();
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

     // Update this method to return Promise<RunResult>
     public async run(sql: string, params: any[] = []): Promise<RunResult> {
        return new Promise<RunResult>((resolve, reject) => {
            this.partsDb.run(sql, params, function (this: sqlite3.Statement, err: Error | null) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this as RunResult);
                }
            });
        });
    }
    

    // Update this method to use the correct database reference
    public async all<T>(sql: string, params: any[] = []): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            this.partsDb.all(sql, params, (err, rows: any[]) => {
                if (err) {
                    console.error(`Error running SQL: ${sql}`, err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    public async get<T>(sql: string, params: any[] = []): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.partsDb.get(sql, params, (err, row: T) => {
                if (err) {
                    console.error(`Error running SQL: ${sql}`, err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    public async exec(sql: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.partsDb.exec(sql, (err) => {
                if (err) {
                    console.error(`Error running SQL: ${sql}`, err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public prepare(sql: string): sqlite3.Statement {
        return this.partsDb.prepare(sql);
    }

    public initializeDatabase(): void {
        this.usersDb.serialize(() => {
            this.usersDb.run(
                `CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    username TEXT,
                    password TEXT
                )`
            );
        });

        this.partsDb.serialize(() => {
            this.partsDb.run(
                `CREATE TABLE IF NOT EXISTS Warehouse (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    delivery_time INTEGER NOT NULL
                )`
            );

            this.partsDb.run(
                `CREATE TABLE IF NOT EXISTS Parts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    availability INTEGER NOT NULL,
                    work_hours INTEGER NOT NULL,
                    warehouse_id INTEGER,
                    price REAL NOT NULL,
                    FOREIGN KEY (warehouse_id) REFERENCES Warehouse(id)
                )`
            );

            this.partsDb.run(
                `CREATE TABLE IF NOT EXISTS Orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    client_name TEXT NOT NULL,
                    order_date TEXT NOT NULL,
                    total_cost REAL NOT NULL,
                    labor_cost REAL NOT NULL,
                    total_time INTEGER NOT NULL,
                    ETADelivery TEXT NOT NULL
                )`
            );

            this.partsDb.run(
                `CREATE TABLE IF NOT EXISTS OrderParts (
                    order_id INTEGER NOT NULL,
                    part_id INTEGER NOT NULL,
                    quantity INTEGER NOT NULL,
                    PRIMARY KEY (order_id, part_id),
                    FOREIGN KEY (order_id) REFERENCES Orders(id),
                    FOREIGN KEY (part_id) REFERENCES Parts(id)
                )`
            );
        });
    }

    public async seedData(): Promise<void> {
        const warehouses: Warehouse[] = [
            { name: 'Warehouse A', delivery_time: 24 },
            { name: 'Warehouse B', delivery_time: 48 }
        ];

        const parts: Part[] = [
            { name: 'Brake Pads', availability: 10, work_hours: 4, warehouse_id: 1, price: 100.0 },
            { name: 'Oil Filter', availability: 20, work_hours: 1, warehouse_id: 2, price: 25.0 },
            { name: 'Air Filter', availability: 15, work_hours: 1, warehouse_id: 1, price: 30.0 },
            { name: 'Spark Plugs', availability: 30, work_hours: 2, warehouse_id: 2, price: 50.0 }
        ];

        try {
            await Promise.all([
                ...warehouses.map(warehouse => 
                    this.run(
                        `INSERT INTO Warehouse (name, delivery_time) VALUES (?, ?)`,
                        [warehouse.name, warehouse.delivery_time]
                    )
                ),
                ...parts.map(part => 
                    this.run(
                        `INSERT INTO Parts (name, availability, work_hours, warehouse_id, price) VALUES (?, ?, ?, ?, ?)`,
                        [part.name, part.availability, part.work_hours, part.warehouse_id, part.price]
                    )
                )
            ]);
            console.log('Seed data successfully inserted.');
        } catch (err: Error | any) {
            console.error('Error seeding data:', err.message);
            throw err; // Opcjonalnie możesz zdecydować się na rzucenie błędu po logowaniu
        }
    }

    public async checkIfDbIsEmpty(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.partsDb.get('SELECT COUNT(*) AS count FROM Parts', [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    this.partsDb.get('SELECT COUNT(*) AS count FROM Warehouse', [], (err2, row2) => {
                        if (err2) {
                            reject(err2);
                        } else {
                            const count1 = (row as { count: number }).count;
                            const count2 = (row2 as { count: number }).count;
                            resolve(count1 === 0 && count2 === 0);
                        }
                    });
                }
            });
        });
    }

    public async seedExampleDatabase(): Promise<void> {
        try {
            const isEmpty = await this.checkIfDbIsEmpty();
            if (isEmpty) {
                await this.seedData();
            }
        } catch (error: any) {
            console.error(`Error seeding database: ${error.message}`);
        }
    }

    public getUsersDb(): SQLiteDatabase {
        return this.usersDb;
    }

    public getPartsDb(): SQLiteDatabase {
        return this.partsDb;
    }
}

const database = Database.getInstance(); // Singleton instance

export { database };
