const { partsDb } = require('../database');

const getAllParts = (req, res) => {
    partsDb.all("SELECT * FROM Parts", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

const createPart = (req, res) => {
    const { name, availability, work_hours, warehouse_id, price } = req.body;

    partsDb.run(
        "INSERT INTO Parts (name, availability, work_hours, warehouse_id, price) VALUES (?, ?, ?, ?, ?)",
        [name, availability, work_hours, warehouse_id, price],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID });
        }
    );
};

const deletePart = (req, res) => {
    const { id } = req.params;

    partsDb.run("DELETE FROM Parts WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(204).end();
    });
};

module.exports = {
    getAllParts,
    createPart,
    deletePart
};
