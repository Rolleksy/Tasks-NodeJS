const {usersDb} = require('../database');

// Create a new user
const createUser = (username, hashedPassword, callback) => {
    const stmt = usersDb.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword, function (err) {
        callback(err, this.lastID);
    });
    stmt.finalize();
};

// Find a user by username
const findUserByUsername = (username, callback) => {
    usersDb.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, user || null);
        }
    });
};

module.exports = {
    createUser,
    findUserByUsername
};
