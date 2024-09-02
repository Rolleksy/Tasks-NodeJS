"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
class UserService {
    constructor(db) {
        this.db = db;
    }
    createUser(username, hashedPassword, callback) {
        const stmt = this.db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
        stmt.run(username, hashedPassword, function (err) {
            callback(err, this === null || this === void 0 ? void 0 : this.lastID);
        });
        stmt.finalize();
    }
    findUserByUsername(username, callback) {
        this.db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, user || null);
            }
        });
    }
}
// Instance of the UserService class
const userService = new UserService(database_1.database.getUsersDb());
exports.default = userService;
