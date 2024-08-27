const { getAllParts, createPart, deletePart } = require('../controllers/partController');
const { partsDb } = require('../database'); 

jest.mock('../database', () => ({
    partsDb: {
        all: jest.fn(),
        run: jest.fn(),
    },
}));

describe('Parts Controller', () => {
    describe('getAllParts', () => {
        it('should return all parts', async () => {
            const mockParts = [
                { id: 1, name: 'Part A', availability: 10, work_hours: 5, price: 50 },
                { id: 2, name: 'Part B', availability: 5, work_hours: 3, price: 30 },
            ];

            partsDb.all.mockImplementation((sql, params, callback) => {
                callback(null, mockParts);
            });

            const req = {};
            const res = {
                json: jest.fn(),
                status: jest.fn().mockReturnThis(),
            };

            await getAllParts(req, res);

            expect(partsDb.all).toHaveBeenCalledWith("SELECT * FROM Parts", [], expect.any(Function));
            expect(res.json).toHaveBeenCalledWith(mockParts);
        });

        it('should handle database errors', async () => {
            const mockError = new Error('Database error');

            partsDb.all.mockImplementation((sql, params, callback) => {
                callback(mockError, null);
            });

            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await getAllParts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
        });
    });

    describe('Parts Controller', () => {
        describe('createPart', () => {
            it('should create a new part', async () => {
                const newPart = {
                    name: 'Test Part',
                    availability: 10,
                    work_hours: 5,
                    warehouse_id: 1,
                    price: 100
                };
    
                const req = {
                    body: newPart
                };
                
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                partsDb.run = jest.fn((sql, params, callback) => {
                    callback.call({ lastID: 1 }, null);
                });
    
                await createPart(req, res);
    
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith({ id: 1 });
            });
    
            it('should handle database errors when creating a part', async () => {
                const req = {
                    body: {
                        name: 'Test Part',
                        availability: 10,
                        work_hours: 5,
                        warehouse_id: 1,
                        price: 100
                    }
                };
    
                const res = {
                    status: jest.fn().mockReturnThis(),
                    json: jest.fn()
                };

                partsDb.run = jest.fn((sql, params, callback) => {
                    callback(new Error('Database error'));
                });
    
                await createPart(req, res);
    
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
            });
        });
    });
    
    

    describe('deletePart', () => {
        it('should delete a part by ID', async () => {
            partsDb.run.mockImplementation((sql, params, callback) => {
                callback(null);
            });

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                end: jest.fn(),
            };

            await deletePart(req, res);

            expect(partsDb.run).toHaveBeenCalledWith(
                "DELETE FROM Parts WHERE id = ?",
                [req.params.id],
                expect.any(Function)
            );
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalled();
        });

        it('should handle database errors when deleting a part', async () => {
            const mockError = new Error('Database error');

            partsDb.run.mockImplementation((sql, params, callback) => {
                callback(mockError);
            });

            const req = { params: { id: 1 } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };

            await deletePart(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: mockError.message });
        });
    });
});
