# Service API Endpoints

## Available Endpoints

| Method     | Endpoint                         | Description               | Request                                                       | Status  | Response                                          |
| ---------- | -------------------------------- | ------------------------- | ------------------------------------------------------------- | ------- | ------------------------------------------------- |
| **GET**    | `/api/v1/employees/:employee_id` | Retrieves all employees.  | None                                                          | **200** | `{ "data": [employees] }`                         |
|            |                                  |                           |                                                               | **404** | `{ "message": "Employee not found" }`             |
|            |                                  |                           |                                                               | **500** | `{ "message": "Unexpected error occurred" }`      |
| **POST**   | `/api/v1/employees`              | Creates a new employees.  | `{ "employee_full_name": "string", "avatar_image": "string"}` | **201** | `{ "employee_id": number }`                       |
|            |                                  |                           |                                                               | **400** | `{ "message": "Owner not found" }`                |
|            |                                  |                           |                                                               | **500** | `{ "message": "Unexpected error occurred" }`      |
| **PUT**    | `/api/v1/employees/:employees`   | Updates a employees.      | `{"employee_full_name": "string", "avatar_image": "string" }` | **200** | `{ "message": "Employee updated successfully" }`  |
|            |                                  |                           |                                                               | **404** | `{ "message": "Employee not found" }`             |
|            |                                  |                           |                                                               | **501** | `{ "message": "Cannot update employee" }`         |
|            |                                  |                           |                                                               | **500** | `{ "message": "Unexpected error occurred" }`      |
| **DELETE** | `/api/v1/employees/:employees`   | Soft deletes a employees. | None                                                          | **200** | `{ "message": "Employees deleted successfully" }` |
|            |                                  |                           |                                                               | **404** | `{ "message": "Employee not found" }`             |
|            |                                  |                           |                                                               | **501** | `{ "message": "Cannot delete employee" }`         |
|            |                                  |                           |                                                               | **500** | `{ "message": "Unexpected error occurred" }`      |

## Endpoint Descriptions

### **GET** `/api/v1/employees/:employee_id`

- **Description**: Retrieves a specific employee by `employee_id`.
- **Response**:
    - **200 OK**: Returns the employee details.
    - **404 Not Found**: If the employee does not exist.
    - **500 Internal Server Error**: In case of an unexpected error.

### **POST** `/api/v1/employees`

- **Description**: Creates a new employee.
- **Request Body**:
    - `employee_full_name` (string, required): Employee full name.
    - `avatar_image` (string, optional): Employee avatar.
- **Response**:
    - **201 Created**: Returns the created employee's ID.
    - **400 Bad Request**: Owner not found.
    - **500 Internal Server Error**: In case of an unexpected error.

### **PUT** `/api/v1/employees/:employee_id`

- **Description**: Updates a service's details.
- **Request Body**:
    - `employee_full_name` (string, optional): Employee full name.
    - `avatar_image` (string, optional): Employee avatar.
- **Response**:
    - **200 OK**: Returns a success message.
    - **400 Bad Request**: If no valid fields are provided for update.
    - **404 Not Found**: If the service does not found.
    - **501 Not Implemented**: If the update operation fails.
    - **500 Internal Server Error**: In case of an unexpected error.

### **DELETE** `/api/v1/employees/:employee_id`

- **Description**: Soft deletes a employees by marking them as inactive.
- **Response**:
    - **200 OK**: Employee deleted successfully.
    - **404 Not Found**: Employee not found.
    - **501 Not Implemented**: Cannot delete employee.
    - **500 Internal Server Error**: In case of an unexpected error.
