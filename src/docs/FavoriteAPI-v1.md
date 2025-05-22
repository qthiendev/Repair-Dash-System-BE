# Favorite API Endpoints

This document outlines the available favorite-related API endpoints, including their methods, request requirements, and possible responses.

## Available Endpoints

| Method     | Endpoint                         | Description                             | Middleware/Validator                       | Request Body                                   | Status  | Response                                                                     |
| ---------- | -------------------------------- | --------------------------------------- | ------------------------------------------ | ---------------------------------------------- | ------- | ---------------------------------------------------------------------------- |
| **GET**    | `/api/v1/favorites`              | Retrieves a paginated list of favorites | `authenticate`                             | None                                           | **200** | `{ "total": number, "page": number, "total_pages": number, "data": [...] }`  |
| **POST**   | `/api/v1/favorites`              | Adds a new favorite                     | `authenticate`, `addFavoriteValidation`    | `{ "store_id": number, "service_id": number }` | **201** | `{ "message": "Favorite added successfully", "favorite_id": number }`        |
|            |                                  |                                         |                                            |                                                | **400** | `{ "message": "Must provide either store_id or service_id, but not both." }` |
|            |                                  |                                         |                                            |                                                | **404** | `{ "message": "Customer/Store/Service not found" }`                          |
|            |                                  |                                         |                                            |                                                | **403** | `{ "message": "User is not a valid store." }`                                |
| **DELETE** | `/api/v1/favorites/:favorite_id` | Removes a favorite                      | `authenticate`, `deleteFavoriteValidation` | None                                           | **200** | `{ "message": "Favorite deleted successfully" }`                             |
|            |                                  |                                         |                                            |                                                | **404** | `{ "message": "Favorite not found" }`                                        |
|            |                                  |                                         |                                            |                                                | **500** | `{ "message": "Unexpected error occurred" }`                                 |

---

## Endpoint Descriptions

### **GET** `/api/v1/favorites`

- **Description**: Retrieves a paginated list of favorites for the authenticated customer.
- **Middleware**: `authenticate`
- **Query Parameters**:
    - `index` (optional, number) → Page number (default: 1)
    - `max_range` (optional, number) → Number of items per page (default: 10)
    - `store_only` (optional, boolean) → If `true`, returns only store favorites; if `false`, returns only service favorites; if `null`, returns all.
- **Response**:

    - **200 OK**:

        ```json
        {
            "current_page": number,
            "total_pages": number,
            "data": [
                {
                    "favorite_id": number,
                    "is_store": boolean,
                    "store": { "user_id": number, "user_full_name": string, "user_city": string },
                    "service": { "service_id": number, "service_name": string, "service_description": string }
                }
            ]
        }
        ```

---

### **POST** `/api/v1/favorites`

- **Description**: Adds a new favorite (either a store or a service, but not both).
- **Middleware**: `authenticate`, `addFavoriteValidation`
- **Request Body**:

    ```json
    {
        "store_id": number,
        "service_id": number
        //Note that must include 1 of these, not both
    }
    ```
