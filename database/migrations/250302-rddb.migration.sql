DROP DATABASE IF EXISTS `rddb`;
CREATE DATABASE `rddb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `rddb`;

-- Table: authentications
CREATE TABLE `authentications` (
    `authentication_id` INT AUTO_INCREMENT PRIMARY KEY,
    `identifier_email` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `password` VARCHAR(1000)  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `role` ENUM('ADMIN', 'STORE', 'CUSTOMER') NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `delete_flag` BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT `identifier_email_unique` UNIQUE (`identifier_email`)
);

-- Table: users
CREATE TABLE `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_full_name` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `user_phone_number` VARCHAR(20) NOT NULL,
    `user_street` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `user_ward` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `user_district` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `user_city` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `delete_flag` BOOLEAN NOT NULL DEFAULT FALSE,
    `authentication_id` INT NOT NULL,
    CONSTRAINT `fk_users_authentication_id` FOREIGN KEY (`authentication_id`) REFERENCES `authentications`(`authentication_id`)
);

-- Table: system_reports
CREATE TABLE `system_reports` (
    `report_id` INT AUTO_INCREMENT PRIMARY KEY,
    `report_description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `delete_flag` BOOLEAN NOT NULL DEFAULT FALSE,
    `user_id` INT NOT NULL,
    CONSTRAINT `fk_system_reports_users` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);

-- Table: employees
CREATE TABLE `employees` (
    `employee_id` INT AUTO_INCREMENT PRIMARY KEY,
    `employee_full_name` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `delete_flag` BOOLEAN NOT NULL DEFAULT FALSE,
    `owner_id` INT NOT NULL,
    CONSTRAINT `fk_employees_users` FOREIGN KEY (`owner_id`) REFERENCES `users`(`user_id`)
);

-- Table: services
CREATE TABLE `services` (
    `service_id` INT AUTO_INCREMENT PRIMARY KEY,
    `service_name` VARCHAR(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `service_description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `delete_flag` BOOLEAN NOT NULL DEFAULT FALSE,
    `owner_id` INT NOT NULL,
    CONSTRAINT `fk_services_users` FOREIGN KEY (`owner_id`) REFERENCES `users`(`user_id`)
);

-- Table: orders
CREATE TABLE `orders` (
    `order_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `store_address` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `customer_address` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    `order_status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED') NOT NULL,
    `order_feedback` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `delete_flag` BOOLEAN NOT NULL DEFAULT FALSE,
    `service_id` INT NOT NULL,
    `employee_id` INT,
    `customer_id` INT,
    CONSTRAINT `fk_orders_users` FOREIGN KEY (`customer_id`) REFERENCES `users`(`user_id`),
    CONSTRAINT `fk_orders_services` FOREIGN KEY (`service_id`) REFERENCES `services`(`service_id`),
    CONSTRAINT `fk_orders_employees` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`)
);
