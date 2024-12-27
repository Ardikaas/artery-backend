# Seller Management API Documentation

This API provides endpoints for managing sellers and their associated stores, products, and orders. Below is the detailed documentation to help developers interact with the API.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [API Endpoints](#api-endpoints)
   - [Get All Stores](#1-get-all-stores)
   - [Create Store](#2-create-store)
   - [Add Store Product](#3-add-store-product)
   - [Add Order](#4-add-order)
   - [History Order](#5-history-order)
4. [Error Handling](#error-handling)

---

## Prerequisites

- Node.js installed on your machine.
- Prisma CLI installed.
- A configured database with Prisma.
- Environment variables set in a `.env` file:
  ```env
  PORT=3000
  DATABASE_URL="your_database_url"
  ```

---

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize Prisma:
   ```bash
   npx prisma generate
   ```
4. Start the server:
   ```bash
   node app.js
   ```
   The API will be accessible at `http://localhost:<PORT>`.

---

## API Endpoints

### 1. **Get All Stores**

- **URL**: `/stores`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1).
  - `limit` (optional): Number of items per page (default: 10).
- **Response**:
  ```json
  {
    "status": {
      "code": 200,
      "message": "Success"
    },
    "data": [ ... ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalStores": 50,
      "limit": 10
    }
  }
  ```

### 2. **Create Store**

- **URL**: `/stores`
- **Method**: `POST`
- **Request Body** (JSON):
  ```json
  {
    "store_name": "Store Name",
    "store_address": "Address"
  }
  ```
- **Response**:
  ```json
  {
    "status": {
      "code": 200,
      "message": "Success"
    },
    "data": { ... }
  }
  ```

### 3. **Add Store Product**

- **URL**: `/stores/:id/products`
- **Method**: `POST`
- **Path Parameters**:
  - `id`: Store ID.
- **Request Body** (JSON):
  ```json
  {
    "product_id": "Product ID"
  }
  ```
- **Response**:
  ```json
  {
    "status": {
      "code": 200,
      "message": "Store products updated successfully"
    },
    "data": { ... }
  }
  ```

### 4. **Add Order**

- **URL**: `/stores/:id/orders`
- **Method**: `POST`
- **Path Parameters**:
  - `id`: Store ID.
- **Request Body** (JSON):
  ```json
  {
    "active_order_id": "Order ID"
  }
  ```
- **Response**:
  ```json
  {
    "status": {
      "code": 200,
      "message": "Order added successfully"
    },
    "data": { ... }
  }
  ```

### 5. **History Order**

- **URL**: `/stores/:id/history`
- **Method**: `POST`
- **Path Parameters**:
  - `id`: Store ID.
- **Request Body** (JSON):
  ```json
  {
    "history_order_id": "Order ID"
  }
  ```
- **Response**:
  ```json
  {
    "status": {
      "code": 200,
      "message": "Store history updated successfully"
    },
    "data": { ... }
  }
  ```

---

## Error Handling

- **Response Format**:
  ```json
  {
    "status": {
      "code": <error_code>,
      "message": "<error_message>"
    }
  }
  ```
- Example:
  ```json
  {
    "status": {
      "code": 500,
      "message": "Internal Server Error"
    }
  }
  ```
