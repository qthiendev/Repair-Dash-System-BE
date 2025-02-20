USE `rddb`;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE orders;
TRUNCATE TABLE services;
TRUNCATE TABLE employees;
TRUNCATE TABLE system_reports;
TRUNCATE TABLE users;
TRUNCATE TABLE authentications;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `authentications` (`identifer_email`, `password`, `role`) VALUES
    (AES_ENCRYPT('admin@example.com', 'secret_key'), AES_ENCRYPT('password123', 'secret_key'), 'ADMIN'),
    (AES_ENCRYPT('store@example.com', 'secret_key'), AES_ENCRYPT('password123', 'secret_key'), 'STORE'),
    (AES_ENCRYPT('customer@example.com', 'secret_key'), AES_ENCRYPT('password123', 'secret_key'), 'CUSTOMER');

INSERT INTO `users` (`user_full_name`, `user_phone_number`, `user_address`, `authentication_id`) VALUES
    ('Admin User', '1234567890', 'Admin Address', 1),
    ('Store Owner', '0987654321', 'Store Address', 2),
    ('Customer Name', '1122334455', 'Customer Address', 3);

INSERT INTO `system_reports` (`report_description`, `user_id`) VALUES
    ('System running smoothly', 1),
    ('Minor issue detected', 2);

INSERT INTO `services` (`service_name`, `service_description`, `owner_id`) VALUES
    ('Service One', 'Description for Service One', 2),
    ('Service Two', 'Description for Service Two', 2);

INSERT INTO `employees` (`employee_full_name`, `owner_id`) VALUES
    ('Employee One', 2),
    ('Employee Two', 2);

INSERT INTO `orders` (`order_description`, `store_address`, `customer_address`, `order_status`, `customer_id`, `service_id`, `employee_id`) VALUES
    ('Order 1', 'Store Address', 'Customer Address', 'PENDING', 3, 1, 1),
    ('Order 2', 'Store Address', 'Customer Address', 'PROCESSING', 3, 2, 2);
