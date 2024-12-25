# Product Management API Documentation

This API provides endpoints to manage products. It allows CRUD operations, product search, and filtering capabilities.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup](#setup)
3. [API Endpoints](#api-endpoints)
4. [Error Handling](#error-handling)

---

## Prerequisites

- Node.js installed on your machine.
- Prisma CLI installed.
- A database configured with Prisma.
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

### 1. **Get All Products**

- **URL**: `/all`
- **Method**: `GET`
- **Query Parameters**:
  - `page` (optional): Page number (default: 1).
  - `limit` (optional): Number of items per page (default: 10).
  - `type` (optional): Filter by product type.
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
      "totalProducts": 50,
      "limit": 10
    }
  }
  ```

### 2. **Search Products**

- **URL**: `/search`
- **Method**: `GET`
- **Query Parameters**:
  - `search` (required): Search term.
  - `page` (optional): Page number (default: 1).
  - `limit` (optional): Number of items per page (default: 10).
  - `threshold` (optional): Score threshold for filtering results (default: 0.3).
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
      "totalPages": 3,
      "totalProducts": 30,
      "limit": 10
    }
  }
  ```

### 3. **Get Product by ID**

- **URL**: `/:id`
- **Method**: `GET`
- **Path Parameters**:
  - `id`: Product ID.
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

### 4. **Create Product**

- **URL**: `/create`
- **Method**: `POST`
- **Request Body** (JSON):
  ```json
  {
    "name": "Product Name",
    "type": "Type",
    "price": 100,
    "stock": 50,
    "process": "Process",
    "taste_note": "Taste Note",
    "body_level": "Medium",
    "acid_level": "Low",
    "coffe_img": "image_url",
    "shop_id": 123,
    "shop_name": "Shop Name",
    "shop_img": "image_url"
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

### 5. **Update Product by ID**

- **URL**: `/:id`
- **Method**: `PUT`
- **Path Parameters**:
  - `id`: Product ID.
- **Request Body** (JSON):
  - Only the fields to update are required.
- **Response**:
  ```json
  {
    "status": {
      "code": 200,
      "message": "Product updated successfully"
    },
    "data": { ... }
  }
  ```

### 6. **Delete Product**

- **URL**: `/:id`
- **Method**: `DELETE`
- **Path Parameters**:
  - `id`: Product ID.
- **Response**:
  ```json
  {
    "status": {
      "code": 200,
      "message": "Product deleted successfully"
    }
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
