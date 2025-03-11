# Service API Endpoints

## Available Endpoints

| Method | Endpoint | Description | Request | Status | Response |
|--------|---------|-------------|---------|--------|----------|
| **GET** | `/api/v1/service` | Retrieves all service. | None | **200** | `{ "data": [services] }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **GET** | `/api/v1/users/:service` | Retrieves a specific service. | None | **200** | `{ "data": services }` |
| | | | | **404** | `{ "message": "Service not found" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **POST** | `/api/v1/service/create` | Creates a new service. | `{ "service_name": "string", "service_description": "string"}` | **201** | `{ "service_id": number }` |
| | | | | **400** | `{ "message": "service already exists" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **PUT** | `/api/v1/service/edit/:service_id` | Updates a service. | v`{ "service_name": "string", "service_description": "string"}` | **200** | `{ "message": "service updated successfully" }` |
| | | | | **400** | `{ "message": "No valid fields provided for update" }` |
| | | | | **404** | `{ "message": "service not found" }` |
| | | | | **501** | `{ "message": "Cannot update service" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **DELETE**  | `/api/v1/delete/:service_id` | Soft deletes a service. | None | **200** | `{ "message": "service deleted successfully" }` |
| | | | | **404** | `{ "message": "service not found" }` |
| | | | | **501** | `{ "message": "Cannot delete service" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |

## Endpoint Descriptions

### **GET** `/api/v1/service`

- **Description**: Retrieves all service who are not soft deleted.
- **Response**:
  - **200 OK**: Returns the list of service.
  - **500 Internal Server Error**: In case of an unexpected error.

### **GET** `/api/v1/users/:service`

- **Description**: Retrieves a specific service by `service_id`.
- **Response**:
  - **200 OK**: Returns the service details.
  - **404 Not Found**: If the service does not exist.
  - **500 Internal Server Error**: In case of an unexpected error.

### **POST** `/api/v1/service/create`

- **Description**: Creates a new service.
- **Request Body**:
  - `service_name` (string, required): Service name.
  - `service_description` (string, required): service description.
- **Response**:
  - **201 Created**: Returns the created service's ID.
  - **400 Bad Request**: If the service is already registered.
  - **500 Internal Server Error**: In case of an unexpected error.

### **PUT** `/api/v1/service/edit/:service_id`

- **Description**: Updates a service's details.
- **Request Body**:
  - `service_name` (string, optional): Service name.
  - `service_description` (string, optional): service description.
- **Response**:
  - **200 OK**: Returns a success message.
  - **400 Bad Request**: If no valid fields are provided for update.
  - **404 Not Found**: If the users does not exist.
  - **501 Not Implemented**: If the update operation fails.
  - **500 Internal Server Error**: In case of an unexpected error.

### **DELETE** `/api/v1/delete/:service_id`

- **Description**: Soft deletes a service by marking them as inactive.
- **Response**:
  - **200 OK**: Returns a success message.
  - **404 Not Found**: If the service does not exist.
  - **501 Not Implemented**: If the deletion operation fails.
  - **500 Internal Server Error**: In case of an unexpected error.
