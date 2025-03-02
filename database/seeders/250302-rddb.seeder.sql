USE `rddb`;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE orders;
TRUNCATE TABLE services;
TRUNCATE TABLE employees;
TRUNCATE TABLE system_reports;
TRUNCATE TABLE users;
TRUNCATE TABLE authentications;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO `authentications` (`identifier_email`, `password`, `role`) VALUES
    (AES_ENCRYPT('nguyenthanhnhan110503@gmail.com', 'secret_key'), AES_ENCRYPT('$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', 'secret_key'), 'ADMIN'),
    (AES_ENCRYPT('dangvannho7@gmail.com', 'secret_key'), AES_ENCRYPT('$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', 'secret_key'), 'ADMIN'),
    (AES_ENCRYPT('truong10032k@gmail.com', 'secret_key'), AES_ENCRYPT('$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', 'secret_key'), 'ADMIN'),
    (AES_ENCRYPT('addnguyen32@gmail.com', 'secret_key'), AES_ENCRYPT('$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', 'secret_key'), 'ADMIN'),
    (AES_ENCRYPT('trinhquythien.dev@gmail.com', 'secret_key'), AES_ENCRYPT('$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', 'secret_key'), 'ADMIN'),
    (AES_ENCRYPT('dienmayxanh@gmail.com', 'secret_key'), AES_ENCRYPT('$2a$12$bA1Lz622MidYK3PRV1bxyeIiPTQcrhbIiEfmUZWRX.IbHGsR0ebqG', 'secret_key'), 'STORE'),
    (AES_ENCRYPT('decseize4work@gmail.com', 'secret_key'), AES_ENCRYPT('$2a$12$bA1Lz622MidYK3PRV1bxyeIiPTQcrhbIiEfmUZWRX.IbHGsR0ebqG', 'secret_key'), 'STORE'),
    (AES_ENCRYPT('nguyenvana@example.com', 'secret_key'), AES_ENCRYPT('$2a$12$vV8XlRlcufSGicGkBoptceuM5nr5BjTToor8Bf/zT3OVLr9XTEpjq', 'secret_key'), 'CUSTOMER'),
    (AES_ENCRYPT('nguyenvanb@example.com', 'secret_key'), AES_ENCRYPT('$2a$12$vV8XlRlcufSGicGkBoptceuM5nr5BjTToor8Bf/zT3OVLr9XTEpjq', 'secret_key'), 'CUSTOMER');

INSERT INTO `users` (`user_full_name`, `user_phone_number`, `user_street`, `user_ward`, `user_district`, `user_city`, `authentication_id`) VALUES
    ('Nguyễn Thành Nhân', '0379740995', 'K318/17 Tôn Đản', 'Hòa An', 'Cẩm Lệ', 'Đà Nẵng', 1),
    ('Đặng Văn Nhớ', '0773688203', 'K318/17 Tôn Đản', 'Hòa An', 'Cẩm Lệ', 'Đà Nẵng', 2),
    ('Lưu Văn Trường', '0363611957', 'K318/17 Tôn Đản', 'Hòa An', 'Cẩm Lệ', 'Đà Nẵng', 3),
    ('Nguyễn Nhật Thảo', '0354399768', 'K318/17 Tôn Đản', 'Hòa An', 'Cẩm Lệ', 'Đà Nẵng', 4),
    ('Trịnh Quý Thiện', '0395075100', 'K318/17 Tôn Đản', 'Hòa An', 'Cẩm Lệ', 'Đà Nẵng', 5),
    ('Siêu thị Điện Máy Xanh', '02366554477', '100 Lê Lợi', 'Thạch Thang', 'Hải Châu', 'Đà Nẵng', 6),
    ('Điện nước Việt Nam', '02366553388', '22 Phan Đình Phùng', 'Hải Châu 1', 'Hải Châu', 'Đà Nẵng', 7),
    ('Nguyễn Văn A', '0905123456', '40 Bạch Đằng', 'Thạch Thang','Hải Châu', 'Đà Nẵng', 8),
    ('Nguyễn Văn B', '0935678901', '75 Trần Phú', 'Hải Châu 1', 'Hải Châu', 'Đà Nẵng', 9);

INSERT INTO `system_reports` (`report_description`, `user_id`) VALUES
    ('Hệ thống đang hoạt động ổn định', 9),
    ('Phát hiện lỗi nhỏ ở hệ thống quản lý đơn hàng', 7);

INSERT INTO `services` (`service_name`, `service_description`, `owner_id`) VALUES
    ('Sửa chữa điện lạnh', 'Dịch vụ sửa chữa tủ lạnh, máy lạnh tại nhà', 6),
    ('Lắp đặt máy nước nóng', 'Dịch vụ lắp đặt, bảo trì máy nước nóng', 7),
    ('Bảo trì điện nước', 'Dịch vụ sửa chữa, lắp đặt điện nước tại nhà', 7);

INSERT INTO `employees` (`employee_full_name`, `owner_id`) VALUES
    ('Trần Văn Công', 6),
    ('Phạm Quốc Dũng', 6),
    ('Lê Thị Hồng', 7);

INSERT INTO `orders` (`order_description`, `store_address`, `customer_address`, `order_status`, `customer_id`, `service_id`, `employee_id`) VALUES
    ('Sửa tủ lạnh Toshiba tại nhà', '100 Lê Lợi, Hải Châu, Đà Nẵng', '40 Bạch Đằng, Hải Châu, Đà Nẵng', 'PROCESSING', 8, 1, 1),
    ('Lắp đặt máy nước nóng Ariston', '22 Phan Đình Phùng, Thanh Khê, Đà Nẵng', '75 Trần Phú, Sơn Trà, Đà Nẵng', 'COMPLETED', 9, 2, 3),
    ('Kiểm tra tủ lạnh', '22 Phan Đình Phùng, Thanh Khê, Đà Nẵng', '75 Trần Phú, Sơn Trà, Đà Nẵng', 'CANCELLED', 8, 3, 2),
    ('Kiểm tra hệ thống điện tại nhà', '22 Phan Đình Phùng, Thanh Khê, Đà Nẵng', '75 Trần Phú, Sơn Trà, Đà Nẵng', 'PENDING', 8, 3, NULL);
