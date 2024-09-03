# Automotive repair shop assistant - project documentation

Aim of this project is to develop a service assistant for an automotive repair shop which is designed to allow user to choose specific part (or multiple parts) to be replaced, then calculate total cost which includes labor, and can provide estimated time needed to complete order.

Project structure
## Backend

The project is organized using a modular approach with routes and controllers to keep the codebase clean and maintainable. This structure helps separate the API endpoints from the business logic.

### Routes

Routes define the endpoints for interacting with the API. Here’s an example of Orders routes:

    GET /orders: Retrieves all orders,
    GET /orders/:id: Retrieves order details by ID,
    POST /orders: Creates a new order,
    DELETE /orders/:id: Deletes an order by ID.

### Controllers

Controllers handle the business logic for each route. For example, the partsController manages operations related to automotive parts, such as fetching all parts, creating a new part, and deleting a part. Here's an example of methods in Parts controller:

    Retrieve all parts from the database,
    Create a new part with specified attributes,
    Delete a part by its ID.

1. **authController**

The authController.ts manages user authentication and authorization for the application. It handles the processes of user registration, login, and token generation. Key functionalities include validating user credentials, creating and issuing JSON Web Tokens (JWTs) upon successful authentication, and managing user sessions. The controller makes sure of secure access to protected resources by verifying tokens and user permissions. It also handles errors related to authentication failures and provides appropriate responses for unsuccessful login attempts or unauthorized access.

2. **orderController**

This controller manages order operations for a database. It includes methods for retrieving, creating, and deleting orders.

3. **partController**

This controller manages parts in the database with methods to retrieve, create, and delete parts.

- getAllParts method retrieves all records from the Parts table and returns them as a JSON response.
- createPart method inserts a new part into the Parts table, including attributes such as name, availability, work hours, warehouse ID, and price, and responds with the ID of the newly created part.
- deletePart method removes a part from the database based on its ID and confirms the deletion with a 204 No Content status. Each method handles potential errors by returning appropriate HTTP status codes and error messages.

### Services

The `orderService.ts` file is responsible for:

- Retrieving all orders and formatting their data for display.
- Fetching details of a specific order, including associated parts and their quantities.
- Creating a new order, calculating costs, and delivery estimates, and updating part availability.
- Deleting an order and restoring the availability of parts previously included in the order.


### Database

The backend application uses SQLite3 for database management and the dotenv package for environment variable handling. The database connection and schema initialization are defined in a dedicated database.ts file. The application connects to two separate SQLite databases: one for user authentication and one for managing parts, warehouses, and orders. The paths to these databases are specified in the .env file.

### Enviroment variables

The application uses a .env file to manage environment-specific configurations, such as database paths, API port, and secret keys.

### Custom JWT implementation

This project uses a custom implementation of JWT (JSON Web Token) for user authentication. This implementation includes two main components: JWT creation /JWTManager/JWTCreate.ts and JWT verification /JWTManager/JWTVerify. The code is written in Node.js using the crypto module to handle encryption.


## Frontend

Created with React framework, as a simple illustration of how the backend works. It allows user to add order, see calculated total cost and total price of said order in visual form.
## How to run application
### Testing

Prerequisites:

`jest and supertest`

How to run tests:

In order to run tests and receive information about coverage use this command: 
`npm test -- --coverage`

### Linting

Prerequisites:

- ESLint

### Docker compose

Prerequisites:

- Docker

Steps:

- Clone the project repository.
- Navigate to the project directory.
- Run docker-compose up --build to build and start the containers.
- Access the frontend interface via http://localhost:3000.
