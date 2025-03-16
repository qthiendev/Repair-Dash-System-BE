# Users API Endpoints

## Available Endpoints

| Method | Endpoint | Description | Request | Status | Response |
|--------|---------|-------------|---------|--------|----------|
| **GET** | `/api/v1/users` | Retrieves all users. | None | **200** | `{ "data": [users] }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **GET** | `/api/v1/users/:user_id` | Retrieves a specific users. | None | **200** | `{ "data": users }` |
| | | | | **404** | `{ "message": "users not found" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **POST** | `/api/v1/users` | Creates a new users. | `{ "identifier_email": "string", "password": "string", "role": "string", "user_full_name": "string", "user_phone_number": "string", "user_address": "string" }` | **201** | `{ "user_id": number }` |
| | | | | **400** | `{ "message": "users already exists" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **PUT** | `/api/v1/users/:user_id` | Updates a users. | v`{ "user_full_name": "string", "user_phone_number": "string", "user_address": "string", "avatar_image": [base64 or file] }` | **200** | `{ "message": "users updated successfully" }` |
| | | | | **400** | `{ "message": "No valid fields provided for update" }` |
| | | | | **404** | `{ "message": "users not found" }` |
| | | | | **501** | `{ "message": "Cannot update users" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **DELETE**  | `/api/v1/users/:user_id` | Soft deletes a users. | None | **200** | `{ "message": "users deleted successfully" }` |
| | | | | **404** | `{ "message": "users not found" }` |
| | | | | **501** | `{ "message": "Cannot delete users" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |

## Endpoint Descriptions

### **GET** `/api/v1/users`

- **Description**: Retrieves all users who are not soft deleted.
- **Response**:
  - **200 OK**: Returns the list of users.
  - **500 Internal Server Error**: In case of an unexpected error.

### **GET** `/api/v1/users/:user_id`

- **Description**: Retrieves a specific users by `user_id`.
- **Response**:
  - **200 OK**: Returns the users details.
  - **404 Not Found**: If the users does not exist.
  - **500 Internal Server Error**: In case of an unexpected error.

### **POST** `/api/v1/users`

- **Description**: Creates a new users.
- **Request Body**:
  - `identifier_email` (string, required): Email identifier.
  - `password` (string, required): users password.
  - `role` (string, required): users role.
  - `user_full_name` (string, required): Full name of the users.
  - `user_phone_number` (string, optional): users's phone number.
  - `user_address` (string, optional): users's address.
- **Response**:
  - **201 Created**: Returns the created users's ID.
  - **400 Bad Request**: If the email is already registered.
  - **500 Internal Server Error**: In case of an unexpected error.

### **PUT** `/api/v1/users/:user_id`

- **Description**: Updates a users's details.
- **Request Body**:
  - `user_full_name` (string, optional): Full name of the users.
  - `user_phone_number` (string, optional): users's phone number.
  - `user_address` (string, optional): users's address.
- **Response**:
  - **200 OK**: Returns a success message.
  - **400 Bad Request**: If no valid fields are provided for update.
  - **404 Not Found**: If the users does not exist.
  - **501 Not Implemented**: If the update operation fails.
  - **500 Internal Server Error**: In case of an unexpected error.

### **DELETE** `/api/v1/users/:user_id`

- **Description**: Soft deletes a users by marking them as inactive.
- **Response**:
  - **200 OK**: Returns a success message.
  - **404 Not Found**: If the users does not exist.
  - **501 Not Implemented**: If the deletion operation fails.
  - **500 Internal Server Error**: In case of an unexpected error.
