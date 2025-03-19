# Service API Endpoints

## Available Endpoints

| Method | Endpoint | Description | Request | Status | Response |
|--------|---------|-------------|---------|--------|----------|
| **GET** | `/api/v1/report/admin/:report_id?` | Retrieves all specific report. | None | **200** | `{ "data": reports }` |
| | | | | **404** | `{ "message": "Report not found" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **GET** | `/api/v1/report/:report_id?` | Retrieve all user's report. | None | **200** | `{ "data": reports }` |
| | | | | **404** | `{ "message": "Report not found" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **POST** | `/api/v1/report` | Creates a new report. | `{ "report_description": "string", "report_images": "file"}` | **201** | `{ "report_id": number }` |
| | | | | **400** | `{ "message": "Report already exists" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |
| **DELETE**  | `/api/v1/report/:report_id` | Soft deletes a report. | None | **200** | `{ "message": "Report deleted successfully" }` |
| | | | | **404** | `{ "message": "Report not found" }` |
| | | | | **501** | `{ "message": "Cannot delete report" }` |
| | | | | **500** | `{ "message": "Unexpected error occurred" }` |

## Endpoint Descriptions

### **GET** `/api/v1/report/admin/report_id?`

- **Description**: Retrieves all report who are not soft deleted.
- **Response**:
  - **200 OK**: Returns the report details.
  - **404 Not Found**: If the report does not exist.
  - **500 Internal Server Error**: In case of an unexpected error.

### **GET** `/api/v1/report/:report_id?`

- **Description**: Retrieves a specific report by `user_id`.
- **Response**:
  - **200 OK**: Returns the report details.
  - **404 Not Found**: If the report does not exist.
  - **500 Internal Server Error**: In case of an unexpected error.

### **POST** `/api/v1/report`

- **Description**: Creates a new report.
- **Request Body**:
  - `report_description` (string, required): Report description.
  - `report_images` (file, optional): Report images.
- **Response**:
  - **201 Created**: Returns the created report's ID.
  - **400 Bad Request**: If the report is already exists.
  - **500 Internal Server Error**: In case of an unexpected error.

### **DELETE** `/api/v1/report/:report_id`

- **Description**: Soft deletes a report by marking them as inactive.
- **Response**:
  - **200 OK**: Returns a success message.
  - **404 Not Found**: If the report does not exist.
  - **501 Not Implemented**: If the deletion operation fails.
  - **500 Internal Server Error**: In case of an unexpected error.
