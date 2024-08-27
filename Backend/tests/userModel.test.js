const { usersDb } = require('../database');
const { createUser, findUserByUsername } = require('../models/userModel');

describe('User Model', () => {
    const testUser = {
        username: 'testuser',
        hashedPassword: 'hashedpassword'
    };

    beforeEach((done) => {
        usersDb.serialize(() => {
            usersDb.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)", done);
        });
    });

    afterEach((done) => {
        usersDb.serialize(() => {
            usersDb.run("DROP TABLE IF EXISTS users", done);
        });
    });

    it('should create a user and return the user ID', (done) => {
        createUser(testUser.username, testUser.hashedPassword, (err, userId) => {
            expect(err).toBeNull();
            expect(userId).toBeGreaterThan(0);

            findUserByUsername(testUser.username, (err, user) => {
                expect(err).toBeNull();
                expect(user).not.toBeNull();
                expect(user.username).toBe(testUser.username);
                expect(user.password).toBe(testUser.hashedPassword);
                done();
            });
        });
    });

    it('should return null if user is not found', (done) => {
        findUserByUsername('nonexistentuser', (err, user) => {
            expect(err).toBeNull();
            expect(user).toBeNull();
            done();
        });
    });
});
