# Available Endpoints

| Method     | Endpoint    | Description                         | Request               | Status  | Response                                              |
| ---------- | ----------- | ----------------------------------- | --------------------- | ------- | ----------------------------------------------------- |
| **GET**    | `/v1/count` | Retrieves the current count.        | None                  | **200** | `{ "count": number }`                                 |
|            |             |                                     |                       | **500** | `{ "message": "Unexpected error occurred" }`          |
| **POST**   | `/v1/count` | Increments the count by 1.          | None                  | **200** | `{ "message": "Count incremented", "count": number }` |
|            |             |                                     |                       | **500** | `{ "message": "Unexpected error occurred" }`          |
| **PUT**    | `/v1/count` | Sets the count to a specific value. | `{ "value": number }` | **200** | `{ "message": "Count set", "count": number }`         |
|            |             |                                     |                       | **400** | `{ "message": "Value must be a number" }`             |
|            |             |                                     |                       | **500** | `{ "message": "Unexpected error occurred" }`          |
| **DELETE** | `/v1/count` | Resets the count to 0.              | None                  | **200** | `{ "message": "Count reset to 0", "count": number }`  |
|            |             |                                     |                       | **500** | `{ "message": "Unexpected error occurred" }`          |

## Description of Each Endpoint

### 1. **GET** `/v1/count`

- **Description**: Retrieves the current count.
- **Response**:
    - **200 OK**: Returns the current count.
    - **500 Internal Server Error**: In case of an unexpected error.

### 2. **POST** `/v1/count`

- **Description**: Increments the count by 1.
- **Response**:
    - **200 OK**: Returns a message confirming the increment and the new count.
    - **500 Internal Server Error**: In case of an unexpected error.

### 3. **PUT** `/v1/count`

- **Description**: Sets the count to a specific value.
- **Request Body**:
    - `value`: The value to set the count to (must be a number).
- **Response**:
    - **200 OK**: Returns a message confirming the set and the updated count.
    - **400 Bad Request**: If the `value` is not a valid number.
    - **500 Internal Server Error**: In case of an unexpected error.

### 4. **DELETE** `/v1/count`

- **Description**: Resets the count to 0.
- **Response**:
    - **200 OK**: Returns a message confirming the reset and the count.
    - **500 Internal Server Error**: In case of an unexpected error.
