# Automotive repair shop assistant - project documentation

Aim of this project is to develop a service assistant for an automotive repair shop which is designed to allow user to choose specific part (or multiple parts) to be replaced, then calculate total cost which includes labor, and can provide estimated time needed to complete order.

## Project structure

### Backend

The project is organized using a modular approach with routes and controllers to keep the codebase clean and maintainable. This structure helps separate the API endpoints from the business logic.

**Routes**

Routes define the endpoints for interacting with the API. Here’s an example of Orders routes:

- GET /orders: Retrieves all orders,
- GET /orders/:id: Retrieves order details by ID,
- POST /orders: Creates a new order,
- DELETE /orders/:id: Deletes an order by ID.

**Controllers**

Controllers handle the business logic for each route. For example, the partsController manages operations related to automotive parts, such as fetching all parts, creating a new part, and deleting a part.
Here's an example of methods in Parts controller:

- Retrieve all parts from the database,
- Create a new part with specified attributes,
- Delete a part by its ID.

**Database**

The backend application uses SQLite3 for database management and the dotenv package for environment variable handling. The database connection and schema initialization are defined in a dedicated `database.js` file.
The application connects to two separate SQLite databases: one for user authentication and one for managing parts, warehouses, and orders. The paths to these databases are specified in the `.env` file.

**Enviroment variables**

The application uses a .env file to manage environment-specific configurations, such as database paths, API port, and secret keys.

**Custom JWT implementation**

This project uses a custom implementation of JWT (JSON Web Token) for user authentication. This implementation includes two main components: JWT creation `/JWTManager/JWTCreate.js` and JWT verification `/JWTManager/JWTVerify`. The code is written in Node.js using the `crypto` module to handle encryption.

### Frontend

Created with React framework, as a simple illustration of how the backend works. It allows user to add order, see calculated total cost and total price of said order in visual form.

## How to run application

1. Prerequisites:

- Docker

2. Steps:

- Clone the project repository.
- Navigate to the project directory.
- Run `docker-compose up --build` to build and start the containers.
- Access the frontend interface via http://localhost:3000.