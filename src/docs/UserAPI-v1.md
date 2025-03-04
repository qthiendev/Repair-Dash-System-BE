# User API Endpoints

## Available Endpoints

| Method | Endpoint | Description | Request | Status | Response |
|--------|---------|-------------|---------|--------|----------|
| **GET** | `/api/v1/user` | Retrieves all users. | None | **200** | `{ "data": [users] }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **GET** | `/api/v1/user/:user_id` | Retrieves a specific user. | None | **200** | `{ "data": user }` |
| | | | | **404** | `{ "message": "User not found" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **POST** | `/api/v1/user` | Creates a new user. | `{ "identifier_email": "string", "password": "string", "role": "string", "user_full_name": "string", "user_phone_number": "string", "user_address": "string" }` | **201** | `{ "user_id": number }` |
| | | | | **400** | `{ "message": "User already exists" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **PUT** | `/api/v1/user/:user_id` | Updates a user. | `{ "user_full_name": "string", "user_phone_number": "string", "user_address": "string" }` | **200** | `{ "message": "User updated successfully" }` |
| | | | | **400** | `{ "message": "No valid fields provided for update" }` |
| | | | | **404** | `{ "message": "User not found" }` |
| | | | | **501** | `{ "message": "Cannot update user" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **DELETE**  | `/api/v1/user/:user_id` | Soft deletes a user. | None | **200** | `{ "message": "User deleted successfully" }` |
| | | | | **404** | `{ "message": "User not found" }` |
| | | | | **501** | `{ "message": "Cannot delete user" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |

## Endpoint Descriptions

### **GET** `/api/v1/user`

- **Description**: Retrieves all users who are not soft deleted.
- **Response**:
  - **200 OK**: Returns the list of users.
  - **500 Internal Server Error**: In case of an unexpected error.

### **GET** `/api/v1/user/:user_id`

- **Description**: Retrieves a specific user by `user_id`.
- **Response**:
  - **200 OK**: Returns the user details.
  - **404 Not Found**: If the user does not exist.
  - **500 Internal Server Error**: In case of an unexpected error.

### **POST** `/api/v1/user`

- **Description**: Creates a new user.
- **Request Body**:
  - `identifier_email` (string, required): Email identifier.
  - `password` (string, required): User password.
  - `role` (string, required): User role.
  - `user_full_name` (string, required): Full name of the user.
  - `user_phone_number` (string, optional): User's phone number.
  - `user_address` (string, optional): User's address.
- **Response**:
  - **201 Created**: Returns the created user's ID.
  - **400 Bad Request**: If the email is already registered.
  - **500 Internal Server Error**: In case of an unexpected error.

### **PUT** `/api/v1/user/:user_id`

- **Description**: Updates a user's details.
- **Request Body**:
  - `user_full_name` (string, optional): Full name of the user.
  - `user_phone_number` (string, optional): User's phone number.
  - `user_address` (string, optional): User's address.
- **Response**:
  - **200 OK**: Returns a success message.
  - **400 Bad Request**: If no valid fields are provided for update.
  - **404 Not Found**: If the user does not exist.
  - **501 Not Implemented**: If the update operation fails.
  - **500 Internal Server Error**: In case of an unexpected error.

### **DELETE** `/api/v1/user/:user_id`

- **Description**: Soft deletes a user by marking them as inactive.
- **Response**:
  - **200 OK**: Returns a success message.
  - **404 Not Found**: If the user does not exist.
  - **501 Not Implemented**: If the deletion operation fails.
  - **500 Internal Server Error**: In case of an unexpected error.
