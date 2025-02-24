# Database Schema

Below is the ER diagram for the database schema:

```mermaid
erDiagram
    authentiactions ||--|| users : "authentiaction_id"
    users ||--o{ system_reports : "user_id"
    users ||--o{ employees : "user_id as owner_id"
    users ||--o{ services : "user_id as owner_id"
    users ||--o{ orders : "user_id as customer_id"
    services ||--o{ orders : "service_id"
    employees ||--o{ orders : "employee_id"

    authentiactions {
        integer authentiaction_id PK "NOT NULL;"
        blob identifier_email UK "NOT NULL; LIMIT 1000;"
        bold password "NOT NULL; LIMIT 1000;"
        string role "ENUM: ADMIN, STORE, CUSTOMER; NOT NULL;"
        timestamp created_at "NOT NULL; CURRENT_TIMESTAMP;"
        timestamp updated_at "NOT NULL; CURRENT_TIMESTAMP;"
        bool delete_flag "NOT NULL; FALSE;"
    }

    users {
        integer user_id PK "NOT NULL;"
        string user_full_name "NOT NULL; LIMIT 500;"
        string user_phone_number "NOT NULL; LIMIT 20;"
        string user_address "NOT NULL;"
        timestamp created_at "NOT NULL; CURRENT_TIMESTAMP;"
        timestamp updated_at "NOT NULL; CURRENT_TIMESTAMP;"
        bool delete_flag "NOT NULL; FALSE;"
        integer authentiaction_id FK "NOT NULL;"
    }

    system_reports {
        integer report_id PK "NOT NULL;"
        string report_description "NOT NULL;"
        timestamp created_at "NOT NULL; CURRENT_TIMESTAMP;"
        timestamp updated_at "NOT NULL; CURRENT_TIMESTAMP;"
        bool delete_flag "NOT NULL; FALSE;"
        integer user_id FK "NOT NULL;"
    }

    employees {
        integer employee_id PK "NOT NULL;"
        string employee_full_name "NOT NULL; LIMIT 500;"
        timestamp created_at "NOT NULL; CURRENT_TIMESTAMP;"
        timestamp updated_at "NOT NULL; CURRENT_TIMESTAMP;"
        bool delete_flag "NOT NULL; FALSE;"
        integer owner_id FK "NOT NULL;"
    }

    services {
        integer service_id PK "NOT NULL;"
        string service_name "NOT NULL; LIMIT 500;"
        string service_description "NOT NULL;"
        timestamp created_at "NOT NULL; CURRENT_TIMESTAMP;"
        timestamp updated_at "NOT NULL; CURRENT_TIMESTAMP;"
        bool delete_flag "NOT NULL; FALSE;"
        integer owner_id FK "NOT NULL;"
    }

    orders {
        integer order_id PK "NOT NULL;"
        string order_description 
        string store_address "NOT NULL;"
        string customer_address "NOT NULL;"
        string order_status "ENUM: PENDING, PROCESSING, COMPLETED, CANCELLED; NOT NULL"
        string order_feedback
        timestamp created_at "NOT NULL; CURRENT_TIMESTAMP;"
        timestamp updated_at "NOT NULL; CURRENT_TIMESTAMP;"
        bool delete_flag "NOT NULL; FALSE;"
        integer customer_id FK "NOT NULL;"
        integer service_id FK "NOT NULL;"
        integer employee_id FK "NOT NULL;"
    }
```
