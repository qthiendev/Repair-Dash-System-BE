# Service Search API Endpoints

This document outlines the available search-related API endpoints, including their methods, request requirements, and possible responses.

## Available Endpoints

| Method  | Endpoint                      | Description                            | Middleware/Validator | Request Body | Status | Response |
|---------|-------------------------------|----------------------------------------|----------------------|--------------|--------|----------|
| **GET** | `/api/v1/search/services`     | Searches for services based on location and keyword relevance | `None` | None | **200** | `{ "services": [..] }` |
|         |                               |                                        |                      |              | **500** | `{ "message": "Unexpected error occurred" }` |

## Endpoint Descriptions

### **GET** `/api/v1/search/services`

- **Description**: Searches for services based on keyword relevance and location prioritization.
- **Middleware**: None
- **Query Parameters**:
  - `keyword` (string, optional): The search keyword for service or store name.
  - `user_city` (string, optional): The user's city for location-based filtering.
  - `user_district` (string, optional): The user's district for refining results.
  - `user_ward` (string, optional): The user's ward for more precise filtering.
  - `user_street` (string, optional): The user's street for finer location accuracy.
  - `index` (number, optional): The pagination index for result offset.
  - `max_range` (number, optional): Maximum search radius in kilometers.

- **Response**:
  - **200 OK**:
  
    ```json
    {
      "total_pages": INTERGER,
      "current_page": INTERGER,
      "services": [
        {
            "service_id": INTERGER,
            "service_name": STRING,
            "service_image": STRING,
            "owner_id": INTERGER,
            "owner": {
                "user_full_name": STRING,
                "user_avatar": STRING,
                "user_priority": INTERGER,
            },
            "avg_rating": FLOAT,
            "order_times": INTERGER,
            "distance": FLOAT,
            "priority": FLOAT,
        }
      ]
    }
    ```

  - **400 Bad Request**: `{ "message": "Missing required parameters" }`
  - **500 Internal Server Error**: `{ "message": "Unexpected error occurred" }`
