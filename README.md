# Database documentation

This file contains details about implementation of datatbase used in "Automotive Service Assistant". Aim of this database is to provide system for car repair shop, that allows user to select particular part to be replaced, and then system can calculate total time needed for repairs and total cost.


## Tables

### 1. Parts

Stores information about different parts available in shop.

**Columns**

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT, the unique identifier for each part,
- `name`: TEXT NOT NULL, the name of the part,
- `availability`: INTEGER NOT NULL, the quantity of the part available in stock,
- `work_hours`: INTEGER NOT NULL, the number of work hours required for the part to be replaced,
- `warehouse_id`: INTEGER, references the Warehouse table, indicating from which warehouse missing part can be ordered,
- `price`: REAL NOT NULL, the price of the part.

### 2. Warehouse

Stores information about where each unavailable part can be ordered.

**Columns**

     `id`: INTEGER PRIMARY KEY AUTOINCREMENT, the unique identifier for each warehouse,
- `name`: TEXT NOT NULL, the name of the warehouse,
- `delivery_time`: INTEGER NOT NULL, the delivery time associated with the warehouse.

### 3. Orders

Stores information about orders placed in shop.

**Columns**

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT, the unique identifier for each order,
- `client_name`: TEXT NOT NULL, the name of the client who placed the order,
- `order_date`: TEXT NOT NULL, the date when the order was placed.

### 4. OrderParts

Stores information about parts for each order.

**Columns**

- `order_id`: INTEGER NOT NULL, references the Orders table,
- `part_id`: INTEGER NOT NULL, references the Parts table,
- `quantity`: INTEGER NOT NULL, the quantity of each part ordered.


## Relationships

Parts - Warehouse:

Each part is associated with a warehouse, indicated by the warehouse_id column in the Parts table.

Orders - OrderParts

Each order can contain multiple parts, and each part can be part of multiple orders. This many-to-many relationship is managed by the OrderParts table, which links the Orders and Parts tables.

## Used SQL queries

### 1. Creation of `Parts` table:

```sql
CREATE TABLE IF NOT EXISTS Parts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    availability INTEGER NOT NULL,
    work_hours INTEGER NOT NULL,
    warehouse_id INTEGER,
    price REAL NOT NULL,
    FOREIGN KEY (warehouse_id) REFERENCES Warehouse(id)
);
```

### 2. Creation of `Warehouse` table:

```sql
CREATE TABLE IF NOT EXISTS Warehouse (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    delivery_time INTEGER NOT NULL
);
```

### 3. Creation of `Orders` table:

```sql
CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    order_date TEXT NOT NULL
);
```

### 4. Creation of `OrderParts` table:

```sql
CREATE TABLE IF NOT EXISTS OrderParts (
    order_id INTEGER NOT NULL,
    part_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    PRIMARY KEY (order_id, part_id),
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (part_id) REFERENCES Parts(id)
);
```

## Database recreation

Code for creating and seeding this exact database with example data is in `SQLScript.js` file.

For it to work user has to:
1. Enter command `npm init -y` to initialize.
2. Then either `npm install` or `npm install sqlite3` to install SQLite dependency.
3. Finally `node SQLScript` to run.
