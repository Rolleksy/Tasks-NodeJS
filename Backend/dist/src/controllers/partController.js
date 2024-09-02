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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class PartController {
    constructor() {
        this.getAllParts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.db.all("SELECT * FROM Parts", [], (err, rows) => {
                    if (err) {
                        res.status(500).json({ error: err.message });
                    }
                    else {
                        res.json(rows);
                    }
                });
            }
            catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
        this.createPart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, availability, work_hours, warehouse_id, price } = req.body;
            this.db.run("INSERT INTO Parts (name, availability, work_hours, warehouse_id, price) VALUES (?, ?, ?, ?, ?)", [name, availability, work_hours, warehouse_id, price], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                }
                else {
                    res.status(201).json({ id: this.lastID });
                }
            });
        });
        this.deletePart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            this.db.run("DELETE FROM Parts WHERE id = ?", [id], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                }
                else if (this.changes === 0) {
                    res.status(404).json({ error: "Part not found" });
                }
                else {
                    res.status(204).end();
                }
            });
        });
        this.db = database_1.database.getPartsDb();
    }
}
exports.default = PartController;
