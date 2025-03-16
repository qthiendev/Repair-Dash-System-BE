# Order API Endpoints

This document outlines the available order-related API endpoints, including their methods, request requirements, and possible responses.

## Available Endpoints

| Method  | Endpoint                  | Description                         | Middleware/Validator            | Request Body | Status | Response |
|---------|---------------------------|-------------------------------------|----------------------------------|--------------|--------|----------|
| **GET**  | `/api/v1/orders/:order_id?`  | Retrieves orders (all or specific) | `authenticate`                   | None         | **200** | `{ "orders": [..] }` or `{ "order": {...} }` |
|         |                           |                                     |                                  |              | **403** | `{ "message": "You are not allowed to read this order." }` |
|         |                           |                                     |                                  |              | **404** | `{ "message": "Order not found" }` |
| **POST** | `/api/v1/orders`         | Creates a new order                 | `authenticate`, `createOrderValidation` | `{ "service_id": number, "order_description": string, "customer_full_name": string, "customer_phone_number": string, "customer_address": string, "order_images": [base64 or files] }` | **201** | `{ "message": "Order created successfully", "order_id": number }` |
|         |                           |                                     |                                  |              | **400** | `{ "message": "Invalid service or customer" }` |
|         |                           |                                     |                                  |              | **500** | `{ "message": "Unexpected error occurred" }` |
| **PUT**  | `/api/v1/orders/:order_id` | Updates an existing order           | `authenticate`, `updateOrderValidation` | `{ [updateData] }` | **200** | `{ "message": "Order updated successfully", "order": {...} }` |
|         |                           |                                     |                                  |              | **403** | `{ "message": "You are not allowed to update this order" }` |
|         |                           |                                     |                                  |              | **404** | `{ "message": "Order not found" }` |
|         |                           |                                     |                                  |              | **400** | `{ "message": "Invalid employee" }` |
| **DELETE** | `/api/v1/orders/:order_id` | Deletes an order                   | `authenticate`, `ensureAdmin`                   | None         | **200** | `{ "message": "Order deleted successfully" }` |
|         |                           |                                     |                                  |              | **403** | `{ "message": "You are not allowed to delete this order" }` |
|         |                           |                                     |                                  |              | **404** | `{ "message": "Order not found" }` |
|         |                           |                                     |                                  |              | **400** | `{ "message": "Order is already deleted" }` |
| **GET**  | `/api/v1/orders/services/:service_id`       | Retrieves checkout details for a service | `authenticate`, `readCheckoutValidation` | None | **200** | `{ "checkout": {...} }` |
|         |                           |                                     |                                  |              | **404** | `{ "message": "Customer/Service/Store not found" }` |
|         |                           |                                     |                                  |              | **500** | `{ "message": "Unexpected error occurred" }` |

## Endpoint Descriptions

### **GET** `/api/v1/orders/:order_id?`

- **Description**: Fetches all orders or a specific order by ID.
- **Middleware**: `authenticate`
- **Request Parameters**:
  - `order_id` (optional, number): The ID of the order to retrieve.
- **Response**:
  - **200 OK**: `{ "orders": [...] }` or `{ "order": {...} }`
  - **403 Forbidden**: `{ "message": "You are not allowed to read this order." }`
  - **404 Not Found**: `{ "message": "Order not found" }`
  - **500 Internal Server Error**: `{ "message": "Unexpected error occurred" }`

### **POST** `/api/v1/orders`

- **Description**: Creates a new order.
- **Middleware**: `authenticate`, `createOrderValidation`
- **Request Body**:

  ```json
  { 
    "service_id": number,
    "order_description": string,
    "customer_full_name": string,
    "customer_phone_number": string,
    "customer_address": string,
    "order_images": [base64 or files]
  }
  ```

- **Response**:
  - **201 Created**: `{ "message": "Order created successfully", "order_id": number }`
  - **400 Bad Request**: `{ "message": "Customer not found.", "code": -1 }`
  - **400 Bad Request**: `{ "message": "Service not found.", "code": -2 }`
  - **400 Bad Request**: `{ "message": "Store not found.", "code": -3 }`
  - **400 Bad Request**: `{ "message": "Store not allowed to order its own service.", "code": -4 }`
  - **500 Internal Server Error**: `{ "message": "Unexpected error occurred" }`

### **PUT** `/api/v1/orders/:order_id`

- **Description**: Updates an existing order.
- **Middleware**: `authenticate`, `updateOrderValidation`
- **Request Body**:
  - PENDING:
    - CUSTOMER:

      ```json
      { 
        "customer_full_name": string, 
        "customer_phone_number": string, 
        "customer_address": string, 
        "order_description": string,
        "order_status": "CANCELED",
        "order_images": [base64 or files]
      }
      ```

    - STORE:

      ```json
      { 
        "order_status": 1 of "PROCESSING", "CANCELED", "COMPLETED",
        "order_description": string,
        "employee_id": int -> when update "PENDING" to "PROCESSING"
      }
      ```

  - PROCESSING:

    - STORE:

        ```json
        { 
          "order_status": 1 of "CANCELED", "COMPLETED",
          "order_description": string,
        }
        ```

  - COMPLETED:

    - CUSTOMER:

      ```json
      { 
        "order_feedback": string,
        "order_rating": 1-5, 
      }
      ```

- **Response**:
  - **200 OK**: `{ "message": "Order updated successfully" }`
  - **403 Forbidden**: `{ "message": "You are not allowed to update this order.", "code": -3 }`
  - **404 Not Found**: `{ "message": "Order not found.", "code": -1}`
  - **400 Bad Request**: `{ message: 'Employee not found.', code: -2 }`

### **DELETE** `/api/v1/orders/:order_id`

- **Description**: Deletes an order (soft delete).
- **Middleware**: `authenticate`, `ensureAdmin`
- **Query Parameters**:
  - `order_id` (number, required)
- **Response**:
  - **200 OK**: `{ "message": "Order deleted successfully" }`
  - **403 Forbidden**: `{ "message": "You are not allowed to delete this order", code: -3 }`
  - **404 Not Found**: `{ "message": "Order not found", code: -1 }`
  - **400 Bad Request**: `{ "message": "Order is already deleted", code: -2 }`

### **GET** `/api/v1/orders/services/:service_id`

- **Description**: Retrieves checkout details for a given service.
- **Middleware**: `authenticate`, `readCheckoutValidation`
- **Query Parameters**:
  - `service_id` (number, required)
- **Response**:

  - **200 OK**:

    ```json
      { 
        "checkout": {
            "customer": {
                "user_id": integer,
                "user_full_name": string,
                "user_phone_number": string,
                "user_street": string,
                "user_ward": string,
                "user_district": string,
                "user_city": string,
                "authentication_id": integer,
                "createdAt": date,
                "updatedAt": date
            },
            "service": {
                "service_id": integer,
                "service_name": string,
                "service_description": string,
                "owner_id": integer,
                "createdAt": date,
                "updatedAt": date,
                "owner": {
                    "user_id": integer,
                    "user_full_name": string,
                    "user_street": string,
                    "user_ward": string,
                    "user_district": string,
                    "user_city": string,
                    "authentication_id": integer,
                    "createdAt": date,
                    "updatedAt": date,
                    "employees": [
                        {
                            "employee_id": integer,
                            "employee_full_name": string,
                            "owner_id": integer,
                            "createdAt": date,
                            "updatedAt": date
                        },...
                    ]
                }
            }
        }
      }

    ```

  - **404 Not Found**: `{ "message": "Customer not found.", "code": -1 }`
  - **404 Not Found**: `{ "message": "Service not found.", "code": -2 }`
  - **404 Not Found**: `{ "message": "Store not found.", "code": -3 }`
  - **403 Not Found**: `{ "message": "Store not allow to order own service.", "code": -4 }`
  - **500 Internal Server Error**: `{ "message": "Unexpected error occurred" }`
