const {usersDb} = require('../database');

const createUser = (username, hashedPassword, callback) => {
    const stmt = usersDb.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword, function (err) {
        callback(err, this.lastID);
    });
    stmt.finalize();
};

const findUserByUsername = (username, callback) => {
    usersDb.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        callback(err, user);
    });
};

module.exports = {
    createUser,
    findUserByUsername
};
