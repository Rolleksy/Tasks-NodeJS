import { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { database } from '../database/database';

class PartController {
    private db: sqlite3.Database;

    constructor() {
        this.db = database.getPartsDb();
    }

    public getAllParts = async (req: Request, res: Response): Promise<void> => {
        try {
            this.db.all("SELECT * FROM Parts", [], (err: Error | null, rows: any[]) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.json(rows);
                }
            });
        } catch (err) {
            res.status(500).json({ error: (err as Error).message });
        }
    };

    public createPart = async (req: Request, res: Response): Promise<void> => {
        const { name, availability, work_hours, warehouse_id, price } = req.body;

        this.db.run(
            "INSERT INTO Parts (name, availability, work_hours, warehouse_id, price) VALUES (?, ?, ?, ?, ?)",
            [name, availability, work_hours, warehouse_id, price],
            function (this: sqlite3.RunResult, err: Error | null) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(201).json({ id: this.lastID });
                }
            }
        );
    };

    public deletePart = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;

        this.db.run(
            "DELETE FROM Parts WHERE id = ?",
            [id],
            function (this: sqlite3.RunResult, err: Error | null) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else if (this.changes === 0) {
                    res.status(404).json({ error: "Part not found" });
                } else {
                    res.status(204).end();
                }
            }
        );
    };
}

export default PartController;
