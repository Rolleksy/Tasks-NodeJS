import OrderService from '../src/services/orderService'; // Dostosuj ścieżkę
import Database from '../src/database/database'; // Dostosuj ścieżkę

// Mockujemy klasę Database
jest.mock('../src/database/database', () => {
    const mDatabase = {
        all: jest.fn(),
        run: jest.fn(),
        get: jest.fn(),
        exec: jest.fn(),
        prepare: jest.fn(),
    };

    return {
        // Magic - mocking the default export, from database.ts. It recognizes the getInstance method and database as a ES6 module
        __esModule: true,
        default: {
            getInstance: jest.fn(() => mDatabase),
        },
    };
});

describe('OrderService', () => {
    let orderService: OrderService;
    let dbMock: any;

    beforeEach(() => {
        // Tworzymy instancję OrderService przed każdym testem
        orderService = new OrderService();
        dbMock = Database.getInstance();
        jest.clearAllMocks();
    });

    it('should return a list of orders with the correct format', async () => {
        // Mockujemy odpowiedź bazy danych
        dbMock.all.mockResolvedValue([
            {
                id: 1,
                client_name: 'John Doe',
                order_date: '2024-09-01',
                total_cost: 150.0,
                labor_cost: 50.0,
                total_time: 10,
                ETADelivery: '2024-09-05',
            },
            {
                id: 2,
                client_name: 'Jane Smith',
                order_date: '2024-09-02',
                total_cost: 200.0,
                labor_cost: 60.0,
                total_time: 12,
                ETADelivery: '2024-09-06',
            },
        ]);

        const orders = await orderService.getOrders();

        expect(orders).toEqual([
            {
                id: 1,
                Date: '2024-09-01',
                Client: 'John Doe',
                Total_Cost: '$150.00',
                Labor_Cost: '$50.00',
                Parts_Cost: '$100.00',
                Total_Time: '10 hours',
                ETA_Delivery: '2024-09-05',
            },
            {
                id: 2,
                Date: '2024-09-02',
                Client: 'Jane Smith',
                Total_Cost: '$200.00',
                Labor_Cost: '$60.00',
                Parts_Cost: '$140.00', 
                Total_Time: '12 hours',
                ETA_Delivery: '2024-09-06',
            },
        ]);
    });

    it('should handle errors from the database', async () => {
        // Mockujemy błąd bazy danych
        dbMock.all.mockRejectedValue(new Error('Database error'));

        await expect(orderService.getOrders()).rejects.toThrow('Database error');
    });

    it('should return order details for a given order ID', async () => {
        dbMock.all.mockResolvedValue([
            {
                order_id: 1,
                client_name: 'John Doe',
                order_date: '2024-09-01',
                total_cost: 150.0,
                labor_cost: 50.0,
                total_time: 10,
                part_id: 1,
                part_name: 'Brake Pads',
                quantity: 2,
                price: 100.0,
                work_hours: 4,
            },
        ]);

        const orderDetails = await orderService.getOrderDetails(1);

        expect(orderDetails).toEqual({
            id: 1,
            client_name: 'John Doe',
            order_date: '2024-09-01',
            total_cost: 150.0,
            labor_cost: 50.0,
            total_time: 10,
            parts: [
                {
                    part_id: 1,
                    part_name: 'Brake Pads',
                    quantity: 2,
                    price: 100.0,
                    work_hours: 4,
                },
            ],
        });
    });

    it('should return null if no details found for a given order ID', async () => {
        dbMock.all.mockResolvedValue([]);

        const orderDetails = await orderService.getOrderDetails(1);

        expect(orderDetails).toBeNull();
    });

    it('should handle errors while fetching order details', async () => {
        dbMock.all.mockRejectedValue(new Error('Database error'));

        await expect(orderService.getOrderDetails(1)).rejects.toThrow('Database error');
    });

    it('should create an order and return its ID', async () => {
        dbMock.run.mockResolvedValue({ lastID: 1 });
        dbMock.all.mockResolvedValue([
            { part_id: 1, price: 100.0, work_hours: 4, availability: 10, delivery_time: 2 }
        ]);
    
        const result = await orderService.createOrder({
            client_name: 'John Doe',
            total_cost: 150.0,
            labor_cost: 50.0,
            total_time: 10,
            ETADelivery: '2024-09-05',
            parts: [
                { part_id: 1, quantity: 2 }
            ],
        });
    
        expect(result).toEqual({ order_id: 1 });
    });

    it('should handle errors while creating an order', async () => {
        dbMock.run.mockRejectedValue(new Error('Database error'));

        await expect(orderService.createOrder({
            client_name: 'John Doe',
            total_cost: 150.0,
            labor_cost: 50.0,
            total_time: 10,
            ETADelivery: '2024-09-05',
            parts: [
                { part_id: 1, quantity: 2 },
            ],
        })).rejects.toThrow('Database error');
    });

    it('should delete an order', async () => {
        dbMock.run.mockResolvedValue({});

        await expect(orderService.deleteOrder(1)).resolves.toBeUndefined();
    });

    it('should handle errors while deleting an order', async () => {
        dbMock.run.mockRejectedValue(new Error('Database error'));

        await expect(orderService.deleteOrder(1)).rejects.toThrow('Database error');
    });
});
