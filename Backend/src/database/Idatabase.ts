import sqlite3, {RunResult} from 'sqlite3';

export interface IDatabase {
    run(sql: string, params?: any[]): Promise<RunResult>;

    all<T>(sql: string, params?: any[]): Promise<T[]>;

    get<T>(sql: string, params?: any[]): Promise<T>;

    exec(sql: string): Promise<void>;

    prepare(sql: string): sqlite3.Statement;

}
