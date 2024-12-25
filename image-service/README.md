# Image Management API Documentation

This API provides functionalities to upload and retrieve image files (product images, user profile images, store profile images) and manage their storage.

## API Endpoints

### 1. Upload Product Image

- **URL**: `/upload-product`
- **Method**: `POST`
- **Request Body**:
  - `image`: Image file to be uploaded (multipart/form-data).
  - `name`: Optional. The name for the image (default is timestamp).
- **Response**:
  - **200**: Success
    ```json
    {
      "status": {
        "code": 200,
        "message": "Image uploaded successfully",
        "filePath": ".../product_images/filename.jpg"
      }
    }
    ```
  - **400**: Invalid file type
    ```json
    {
      "status": {
        "code": 400,
        "message": "File type not accepted. Please upload a file in jpg, png, jpeg, svg, or raw format."
      }
    }
    ```
  - **400**: No file uploaded
    ```json
    {
      "status": {
        "code": 400,
        "message": "There is no file uploaded"
      }
    }
    ```

### 2. Upload User Profile Image

- **URL**: `/upload-user`
- **Method**: `POST`
- **Request Body**:
  - `image`: Image file to be uploaded (multipart/form-data).
- **Response**:
  - **200**: Success
    ```json
    {
      "status": {
        "code": 200,
        "message": "Image uploaded successfully",
        "filePath": ".../user_images/filename.jpg"
      }
    }
    ```

### 3. Upload Store Profile Image

- **URL**: `/upload-store`
- **Method**: `POST`
- **Request Body**:
  - `image`: Image file to be uploaded (multipart/form-data).
- **Response**:
  - **200**: Success
    ```json
    {
      "status": {
        "code": 200,
        "message": "Image uploaded successfully",
        "filePath": ".../store_images/filename.jpg"
      }
    }
    ```

### 4. Get Image

- **URL**: `/:type/:filename`
- **Method**: `GET`
- **Path Parameters**:
  - `type`: Type of the image (`product_images`, `user_images`, or `store_images`).
  - `filename`: The image file name.
- **Response**: Returns the image file.

  - **200**: Image file successfully retrieved
    - The image file will be sent directly to the client.
  - **404**: Image not found
    ```json
    {
      "status": {
        "code": 404,
        "message": "Image not found"
      }
    }
    ```

---

## File Upload Handling

- **Multer**: The API uses `multer` to handle file uploads, and stores the files on the server’s disk.
- **File Types**: Only JPEG, PNG, JPG, SVG, and RAW files are allowed.
- **File Size Limit**: The maximum allowed file size is 35MB. If the file exceeds this limit, it will be rejected.
- **File Storage Path**: Uploaded images are stored in the following directories:
  - `./uploads/product_images`
  - `./uploads/user_images`
  - `./uploads/store_images`
- **Storage Creation**: If the target directory does not exist, it will be created automatically.

---

## Error Handling

Errors are returned in the following format:

- **Response Format**:
  ```json
  {
    "status": {
      "code": <error_code>,
      "message": "<error_message>"
    }
  }
  ```
