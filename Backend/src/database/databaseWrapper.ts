import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import {IDatabase} from './Idatabase';

export class DatabaseWrapper implements IDatabase {
    private db: sqlite3.Database;

    constructor(db: sqlite3.Database) {
        this.db = db;
    }

    run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this);
                }
            });
        });
    }

    all<T>(sql: string, params: any[] = []): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err: Error | null, rows: T[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    get<T>(sql: string, params: any[] = []): Promise<T> {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err: Error | null, row: T) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    exec(sql: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.exec(sql, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    prepare(sql: string): sqlite3.Statement {
        return this.db.prepare(sql);
    }


}
