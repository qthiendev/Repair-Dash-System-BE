# Service API Endpoints

## Available Endpoints

| Method     | Endpoint                            | Description                   | Request                                                                                    | Status  | Response                                               |
| ---------- | ----------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------ | ------- | ------------------------------------------------------ |
| **GET**    | `/api/v1/services/:service_id`      | Retrieves a specific service. | None                                                                                       | **200** | `{ "data": services }`                                 |
|            |                                     |                               |                                                                                            | **404** | `{ "message": "Service not found" }`                   |
|            |                                     |                               |                                                                                            | **500** | `{ "message": "Unexpected error occurred" }`           |
| **GET**    | `/api/v1/services/stores/:owner_id` | Retrieve all store services.  | None                                                                                       | **200** | `{ "data": services }`                                 |
|            |                                     |                               |                                                                                            | **404** | `{ "message": "Store not found" }`                     |
|            |                                     |                               |                                                                                            | **500** | `{ "message": "Unexpected error occurred" }`           |
| **POST**   | `/api/v1/services`                  | Creates a new service.        | `{ "service_name": "string", "service_description": "string", "service_alias": "string" }` | **201** | `{ "service_id": number }`                             |
|            |                                     |                               |                                                                                            | **400** | `{ "message": "Service already exists" }`              |
|            |                                     |                               |                                                                                            | **500** | `{ "message": "Unexpected error occurred" }`           |
| **PUT**    | `/api/v1/services/:service_id`      | Updates a service.            | `{"service_name": "string", "service_description": "string", "service_alias": "string" }`  | **200** | `{ "message": "Service updated successfully" }`        |
|            |                                     |                               |                                                                                            | **400** | `{ "message": "No valid fields provided for update" }` |
|            |                                     |                               |                                                                                            | **404** | `{ "message": "Service not found" }`                   |
|            |                                     |                               |                                                                                            | **501** | `{ "message": "Cannot update service" }`               |
|            |                                     |                               |                                                                                            | **500** | `{ "message": "Unexpected error occurred" }`           |
| **DELETE** | `/api/v1/services/:service_id`      | Soft deletes a service.       | None                                                                                       | **200** | `{ "message": "Service deleted successfully" }`        |
|            |                                     |                               |                                                                                            | **404** | `{ "message": "Service not found" }`                   |
|            |                                     |                               |                                                                                            | **501** | `{ "message": "Cannot delete service" }`               |
|            |                                     |                               |                                                                                            | **500** | `{ "message": "Unexpected error occurred" }`           |

## Endpoint Descriptions

### **GET** `/api/v1/services/:service_id`

- **Description**: Retrieves a specific service by `service_id`.
- **Response**:
    - **200 OK**: Returns the service details.
    - **404 Not Found**: If the service does not exist.
    - **500 Internal Server Error**: In case of an unexpected error.

### **GET** `/api/v1/services/stores/:owner_id`

- **Description**: Retrieve all store services `owner_id`.
- **Response**:
    - **200 OK**: Returns the service details.
    - **404 Not Found**: If the store does not exist.
    - **500 Internal Server Error**: In case of an unexpected error.

### **POST** `/api/v1/services`

- **Description**: Creates a new service.
- **Request Body**:
    - `service_name` (string, required): Service name.
    - `service_description` (string, required): Service description.
- **Response**:
    - **201 Created**: Returns the created service's ID.
    - **400 Bad Request**: If the service is already exists.
    - **500 Internal Server Error**: In case of an unexpected error.

### **PUT** `/api/v1/services/:service_id`

- **Description**: Updates a service's details.
- **Request Body**:
    - `service_name` (string, optional): Service name.
    - `service_description` (string, optional): Service description.
- **Response**:
    - **200 OK**: Returns a success message.
    - **400 Bad Request**: If no valid fields are provided for update.
    - **404 Not Found**: If the service does not found.
    - **501 Not Implemented**: If the update operation fails.
    - **500 Internal Server Error**: In case of an unexpected error.

### **DELETE** `/api/v1/services/:service`

- **Description**: Soft deletes a service by marking them as inactive.
- **Response**:
    - **200 OK**: Returns a success message.
    - **404 Not Found**: If the service does not exist.
    - **501 Not Implemented**: If the deletion operation fails.
    - **500 Internal Server Error**: In case of an unexpected error.
