# Seller API Documentation

## Introduction
The Seller API is designed to manage stores, products, orders, and order history in a scalable manner. This application uses **Node.js**, **Express.js**, and **Prisma ORM** to interact with a PostgreSQL database.

## Features
- Retrieve a list of all stores with pagination.
- Create a new store.
- Add products to a store.
- Add active orders to a store.
- Add order history to a store.

## Prerequisites
- **Node.js** (v14 or later)
- **PostgreSQL** database
- **npm** or **yarn** package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   DATABASE_URL=<your-database-url>
   PORT=<your-port-number>
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the application:
   ```bash
   npm start
   ```

## API Endpoints

### 1. **Get All Stores**
   **Endpoint:** `GET /`

   Retrieves a paginated list of all stores.

   **Query Parameters:**
   - `page` (optional, default: 1): The page number.
   - `limit` (optional, default: 10): The number of stores per page.

   **Response Example:**
   ```json
   {
     "status": {
       "code": 200,
       "message": "Success"
     },
     "data": [
       {
         "id": "1",
         "store_name": "Store A",
         "store_address": "123 Main St"
       }
     ],
     "pagination": {
       "currentPage": 1,
       "totalPages": 5,
       "totalStores": 50
     }
   }
   ```

### 2. **Create Store**
   **Endpoint:** `POST /create`

   Creates a new store.

   **Request Body:**
   ```json
   {
     "store_name": "Store Name",
     "store_address": "Store Address"
   }
   ```

   **Response Example:**
   ```json
   {
     "status": {
       "code": 200,
       "message": "Success"
     },
     "data": {
       "id": "1",
       "store_name": "Store Name",
       "store_address": "Store Address"
     }
   }
   ```

### 3. **Add Store Product**
   **Endpoint:** `PUT /add-product/:id`

   Adds a product to a specific store.

   **Path Parameter:**
   - `id`: The ID of the store.

   **Request Body:**
   ```json
   {
     "product_id": "product-id"
   }
   ```

   **Response Example:**
   ```json
   {
     "status": {
       "code": 200,
       "message": "Store products updated successfully"
     },
     "data": {
       "id": "1",
       "product_id": ["product-id"]
     }
   }
   ```

### 4. **Add Active Order**
   **Endpoint:** `PUT /add-order/:id`

   Adds an active order to a specific store.

   **Path Parameter:**
   - `id`: The ID of the store.

   **Request Body:**
   ```json
   {
     "active_order_id": "order-id"
   }
   ```

   **Response Example:**
   ```json
   {
     "status": {
       "code": 200,
       "message": "Store products updated successfully"
     },
     "data": {
       "id": "1",
       "active_order_id": ["order-id"]
     }
   }
   ```

### 5. **Add Order History**
   **Endpoint:** `PUT /add-history/:id`

   Adds an order to the order history of a specific store.

   **Path Parameter:**
   - `id`: The ID of the store.

   **Request Body:**
   ```json
   {
     "history_order_id": "order-id"
   }
   ```

   **Response Example:**
   ```json
   {
     "status": {
       "code": 200,
       "message": "Store products updated successfully"
     },
     "data": {
       "id": "1",
       "history_order_id": ["order-id"]
     }
   }
   ```

## Error Handling
- **400 Bad Request:** Invalid input or duplicate data.
- **404 Not Found:** Store or resource not found.
- **500 Internal Server Error:** Database or server errors.

## Technologies Used
- **Node.js**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL**

## License
This project is licensed under the MIT License.
