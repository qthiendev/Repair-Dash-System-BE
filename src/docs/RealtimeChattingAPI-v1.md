# RTC Session API Endpoints

This document outlines the available real-time chat session-related API endpoints, including their methods, request requirements, and possible responses.

## Available Endpoints

| Method  | Endpoint                         | Description                          | Middleware/Validator  | Request Body          | Status | Response |
|---------|----------------------------------|--------------------------------------|------------------------|------------------------|--------|----------|
| **GET**  | `/api/v1/rtc/:session_id`       | Retrieves an RTC session            | `authenticate`         | None                   | **200** | `{ "success": true, "session": {...} }` |
|         |                                  |                                      |                        |                        | **404** | `{ "success": false, "message": "Session not found" }` |
|         |                                  |                                      |                        |                        | **500** | `{ "success": false, "message": "Failed to retrieve session" }` |
| **POST** | `/api/v1/rtc/:session_id`       | Updates an RTC session with a message | `authenticate`         | `{ "message": string }` | **200** | `{ "success": true, "session": {...} }` |
|         |                                  |                                      |                        |                        | **404** | `{ "success": false, "message": "Session not found" }` |
|         |                                  |                                      |                        |                        | **500** | `{ "success": false, "message": "Failed to update session" }` |

## Endpoint Descriptions

### **GET** `/api/v1/rtc/:session_id`

- **Description**: Fetches a specific RTC session by ID.
- **Middleware**: `authenticate`
- **Request Parameters**:
  - `session_id` (required, number): The ID of the RTC session to retrieve.
- **Response**:
  - **200 OK**:
  
    ```json
    {
        "success": BOOLEAN,
        "session": {
            "session_id": STRING,
            "user_id": INTERGER,
            "order_id": INTERGER,
            "customer_id": INTERGER,
            "service_id": INTERGER,
            "messages": [
                {
                    "user_id": INTERGER,
                    "message": STRING,
                    "is_sender": BOOLEAN,
                    "timestamp": MM/DD/YYYY hh/mmm/ss
                }
            ]
        }
    }
    ```

  - **404 Not Found**: `{ "success": false, "message": "Session not found" }`
  - **500 Internal Server Error**: `{ "success": false, "message": "Failed to retrieve session" }`

### **POST** `/api/v1/rtc/:session_id`

- **Description**: Updates an RTC session by adding a message.
- **Middleware**: `authenticate`
- **Request Body**:
  
  ```json
  { "message": "string" }
  ```
- **Response**:
  - **200 OK**:
  
    ```json
    {
        "success": BOOLEAN,
        "session": {
            "session_id": STRING,
            "user_id": INTERGER,
            "message": STRING,
            "timestamp": INTERGER
        }
    }
    ```

  - **404 Not Found**: `{ "success": false, "message": "Session not found" }`
  - **500 Internal Server Error**: `{ "success": false, "message": "Failed to update session" }`
