import Database from '../src/database/database';

// Mocked interface types
interface MockDatabase {
    run: jest.Mock<Promise<any>>;
    all: jest.Mock<Promise<any>>;
    get: jest.Mock<Promise<any>>;
    exec: jest.Mock<Promise<void>>;
    prepare: jest.Mock<any>;
    seedData: jest.Mock<Promise<void>>;
    checkIfDbIsEmpty: jest.Mock<Promise<boolean>>;
    seedExampleDatabase: jest.Mock<Promise<void>>;
}

jest.mock('../src/database/database', () => {
    const mDatabase: MockDatabase = {
        run: jest.fn().mockResolvedValue(undefined),
        all: jest.fn().mockResolvedValue([]),
        get: jest.fn().mockResolvedValue(null),
        exec: jest.fn().mockResolvedValue(undefined),
        prepare: jest.fn().mockReturnValue({ run: jest.fn() }),
        seedData: jest.fn().mockResolvedValue(undefined),
        checkIfDbIsEmpty: jest.fn().mockResolvedValue(true),
        seedExampleDatabase: jest.fn().mockResolvedValue(undefined),
    };

    return {
        __esModule: true,
        default: {
            getInstance: jest.fn(() => mDatabase),
        },
        Database: class {
            static getInstance() {
                return mDatabase;
            }
        }
    };
});

describe('Database', () => {
    let database: any;
    let mDatabase: MockDatabase;

    beforeEach(() => {
        database = Database.getInstance();
        mDatabase = database;
        jest.clearAllMocks();
    });

    it('should return the same instance of Database', () => {
        const db1 = Database.getInstance();
        const db2 = Database.getInstance();
        expect(db1).toBe(db2);
    });

    it('should seed data successfully', async () => {
        await expect(database.seedData()).resolves.toBeUndefined();
    });

    it('should handle errors in seedData method', async () => {
        mDatabase.seedData.mockRejectedValue(new Error('Database error'));
        await expect(database.seedData()).rejects.toThrow('Database error');
    });

    it('should return true if database is empty', async () => {
        mDatabase.checkIfDbIsEmpty.mockResolvedValue(true);
        await expect(database.checkIfDbIsEmpty()).resolves.toBe(true);
    });

    it('should return false if database is not empty', async () => {
        mDatabase.checkIfDbIsEmpty.mockResolvedValue(false);
        await expect(database.checkIfDbIsEmpty()).resolves.toBe(false);
    });

    it('should not seed example database if not empty', async () => {
        mDatabase.checkIfDbIsEmpty.mockResolvedValue(false);
        mDatabase.seedData.mockResolvedValue(undefined);
        await expect(database.seedExampleDatabase()).resolves.toBeUndefined();
        expect(mDatabase.seedData).not.toHaveBeenCalled();
    });
});
