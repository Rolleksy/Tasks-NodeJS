import sqlite3, { Database, RunResult } from 'sqlite3';
import { database } from '../database/database';

interface User {
    username: string;
    password: string;
    id?: number;
}

class UserService {
    private db: sqlite3.Database;

    constructor(db: Database) {
        this.db = db;
    }

    public createUser(username: string, hashedPassword: string, callback: (err: Error | null, id?: number) => void): void {
        const stmt = this.db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        stmt.run(username, hashedPassword, function (this: RunResult, err: Error | null) {
            callback(err, this?.lastID);
        });
        stmt.finalize();
    }

    public findUserByUsername(username: string, callback: (err: Error | null, user: User | null) => void): void {
        this.db.get("SELECT * FROM users WHERE username = ?", [username], (err: Error | null, user: User | undefined) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, user || null);
            }
        });
    }
}

// Instance of the UserService class
const userService = new UserService(database.getUsersDb());

export default userService;
