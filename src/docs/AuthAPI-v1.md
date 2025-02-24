# Authentication API Endpoints

This document outlines the available authentication-related API endpoints, including their methods, request requirements, and possible responses.

## Available Endpoints

| Method | Endpoint               | Description                          | Request Body                              | Status | Response                                              |
|--------|------------------------|--------------------------------------|-------------------------------------------|--------|-------------------------------------------------------|
| **GET** | `/api/v1/auth/status` | Checks authentication status         | None                                      | **200** | `{ "auth_status": boolean, "user_id": number \| null }` |
|        |                        |                                      |                                           | **500** | `{ "message": "Unexpected error occurred" }`          |
| **POST** | `/api/v1/auth/login`  | Authenticates a user                 | `{ "identifier_email": "string", "password": "string" }` | **200** | `{ "accessToken": "string" }`                  |
|        |                        |                                      |                                           | **400** | `{ "message": "Login failed." }`                      |
|        |                        |                                      |                                           | **403** | `{ "message": "You are already logged in" }`          |
|        |                        |                                      |                                           | **500** | `{ "message": "Unexpected error occurred" }`          |
| **POST** | `/api/v1/auth/logout` | Logs out a user                      | None                                      | **200** | `{ "message": "Logged out successfully" }`            |
|        |                        |                                      |                                           | **401** | `{ "message": "Unauthorized" }`                       |
|        |                        |                                      |                                           | **401** | `{ "message": "Invalid or expired token" }`           |
|        |                        |                                      |                                           | **500** | `{ "message": "Unexpected error occurred" }`          |
| **POST** | `/api/v1/auth/refresh`| Refreshes an access token            | None (uses `refreshToken` cookie)         | **200** | `{ "accessToken": "string" }`                         |
|        |                        |                                      |                                           | **403** | `{ "message": "No refresh token provided" }`          |
|        |                        |                                      |                                           | **403** | `{ "message": "Invalid or expired refresh token" }`   |
|        |                        |                                      |                                           | **500** | `{ "message": "Unexpected error occurred" }`          |

## Endpoint Descriptions

### **GET** `/api/v1/auth/status`

- **Description**: Checks whether a user is authenticated based on the `accessToken` cookie.
- **Request**: No body required; relies on the `accessToken` cookie.
- **Response**:
  - **200 OK**: 
    - `{ "auth_status": true, "user_id": number }` if authenticated.
    - `{ "auth_status": false, "user_id": null }` if not authenticated (assumed from service behavior).
  - **500 Internal Server Error**: 
    - `{ "message": "Unexpected error occurred" }` if an error occurs during processing.

### **POST** `/api/v1/auth/login`

- **Description**: Authenticates a user with their email and password, returning a JWT access token. Sets `accessToken` and `refreshToken` cookies.
- **Request Body**:
  - `identifier_email` (string, required): User’s email address.
  - `password` (string, required): User’s password.
- **Response**:
  - **200 OK**: 
    - `{ "accessToken": "string" }` on successful login; cookies are set for `accessToken` and `refreshToken`.
  - **400 Bad Request**: 
    - `{ "message": "Login failed." }` if tokens are missing or the service returns an error.
  - **403 Forbidden**: 
    - `{ "message": "You are already logged in" }` if an `accessToken` cookie is present (from `unauthenticate` middleware).
  - **500 Internal Server Error**: 
    - `{ "message": "Unexpected error occurred" }` if an unexpected error occurs.

### **POST** `/api/v1/auth/logout`

- **Description**: Logs out a user by invalidating their tokens. Clears `accessToken` and `refreshToken` cookies.
- **Request**: No body required; uses `accessToken` from either the `Authorization` header (`Bearer <token>`) or cookies.
- **Response**:
  - **200 OK**: 
    - `{ "message": "Logged out successfully" }` on successful logout.
  - **401 Unauthorized**: 
    - `{ "message": "Unauthorized" }` if no `accessToken` is provided.
    - `{ "message": "Invalid or expired token" }` if the token is invalid or expired (from `logoutService`).
  - **500 Internal Server Error**: 
    - `{ "message": "Unexpected error occurred" }` if an unexpected error occurs.

### **POST** `/api/v1/auth/refresh`

- **Description**: Generates a new access token using a valid `refreshToken` cookie.
- **Request**: No body required; relies on the `refreshToken` cookie.
- **Response**:
  - **200 OK**: 
    - `{ "accessToken": "string" }` with a new access token.
  - **403 Forbidden**: 
    - `{ "message": "No refresh token provided" }` if the `refreshToken` cookie is missing.
    - `{ "message": "Invalid or expired refresh token" }` if the refresh token is invalid or expired (from `refreshService`).
  - **500 Internal Server Error**: 
    - `{ "message": "Unexpected error occurred" }` if an unexpected error occurs.