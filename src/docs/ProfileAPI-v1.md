# Users API Endpoints

## Available Endpoints

| Method  | Endpoint          | Description               | Request                                                                                                                                                                                                                                                     | Status  | Response                                        |
| ------- | ----------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------- |
| **GET** | `/api/v1/profile` | Retrieves a profile user. | None                                                                                                                                                                                                                                                        | **200** | `{ "data": profile }`                           |
|         |                   |                           |                                                                                                                                                                                                                                                             | **404** | `{ "message": "User not found." }`              |
|         |                   |                           |                                                                                                                                                                                                                                                             | **500** | `{ "message": "Unexpected error occurred" }`    |
| **PUT** | `/api/v1/profile` | Updates a profile user.   | `{ "user_full_name": "string", "user_phone_number": "string", "user_description": "string", "user_avatar": [base64 or file], "user_street": "string", "user_ward": "string", "user_district": "string", "user_city": "string", "user_priority": "string" }` | **200** | `{ "message": "profile updated successfully" }` |
|         |                   |                           |                                                                                                                                                                                                                                                             | **404** | `{ "message": "users not found" }`              |
|         |                   |                           |                                                                                                                                                                                                                                                             | **501** | `{ "message": "Cannot update profile" }`        |
|         |                   |                           |                                                                                                                                                                                                                                                             | **500** | `{ "message": "Unexpected error occurred" }`    |

## Endpoint Descriptions

### **GET** `/api/v1/profile`

- **Description**: Retrieves a profile user.
- **Response**:
    - **200 OK**: Returns the profile user details.
    - **404 Not Found**: User not found.
    - **500 Internal Server Error**: In case of an unexpected error.

### **PUT** `/api/v1/profile`

- **Description**: Updates a users's profile.
- **Request Body**:
    - `user_full_name` (string, optional): full name of the users.
    - `user_phone_number` (string, optional): users's phone number.
    - `user_description` (string, optional): users's description.
    - `user_avatar` (file, optional): user's avatar.
    - `user_street` (string, optional): users's street.
    - `user_ward` (string, optional): users's ward.
    - `user_district` (string, optional): users's district.
    - `user_city` (string, optional): users's city.
- **Response**:
    - **200 OK**: Returns a success message.
    - **404 Not Found**: If the users does not exist.
    - **501 Not Implemented**: If the update operation fails.
    - **500 Internal Server Error**: In case of an unexpected error.
