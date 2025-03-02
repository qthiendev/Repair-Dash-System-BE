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
    (AES_ENCRYPT(N'nguyenthanhnhan110503@gmail.com', 'secret_key'), AES_ENCRYPT(N'$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', 'secret_key'), N'ADMIN'),
    (AES_ENCRYPT(N'dangvannho7@gmail.com', 'secret_key'), AES_ENCRYPT(N'$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', 'secret_key'), N'ADMIN'),
    (AES_ENCRYPT(N'truong10032k@gmail.com', 'secret_key'), AES_ENCRYPT(N'$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', 'secret_key'), N'ADMIN'),
    (AES_ENCRYPT(N'addnguyen32@gmail.com', 'secret_key'), AES_ENCRYPT(N'$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', 'secret_key'), N'ADMIN'),
    (AES_ENCRYPT(N'trinhquythien.dev@gmail.com', 'secret_key'), AES_ENCRYPT(N'$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', 'secret_key'), N'ADMIN'),
    (AES_ENCRYPT(N'dienmayxanh@gmail.com', 'secret_key'), AES_ENCRYPT(N'$2a$12$bA1Lz622MidYK3PRV1bxyeIiPTQcrhbIiEfmUZWRX.IbHGsR0ebqG', 'secret_key'), N'STORE'),
    (AES_ENCRYPT(N'decseize4work@gmail.com', 'secret_key'), AES_ENCRYPT(N'$2a$12$bA1Lz622MidYK3PRV1bxyeIiPTQcrhbIiEfmUZWRX.IbHGsR0ebqG', 'secret_key'), N'STORE'),
    (AES_ENCRYPT(N'nguyenvana@example.com', 'secret_key'), AES_ENCRYPT(N'$2a$12$vV8XlRlcufSGicGkBoptceuM5nr5BjTToor8Bf/zT3OVLr9XTEpjq', 'secret_key'), N'CUSTOMER'),
    (AES_ENCRYPT(N'nguyenvanb@example.com', 'secret_key'), AES_ENCRYPT(N'$2a$12$vV8XlRlcufSGicGkBoptceuM5nr5BjTToor8Bf/zT3OVLr9XTEpjq', 'secret_key'), N'CUSTOMER');

INSERT INTO `users` (`user_full_name`, `user_phone_number`, `user_street`, `user_ward`, `user_district`, `user_city`, `authentication_id`) VALUES
    (N'Nguyễn Thành Nhân', N'0379740995', N'K318/17 Tôn Đản', N'Hòa An', N'Cẩm Lệ', N'Đà Nẵng', 1),
    (N'Đặng Văn Nhớ', N'0773688203', N'K318/17 Tôn Đản', N'Hòa An', N'Cẩm Lệ', N'Đà Nẵng', 2),
    (N'Lưu Văn Trường', N'0363611957', N'K318/17 Tôn Đản', N'Hòa An', N'Cẩm Lệ', N'Đà Nẵng', 3),
    (N'Nguyễn Nhật Thảo', N'0354399768', N'K318/17 Tôn Đản', N'Hòa An', N'Cẩm Lệ', N'Đà Nẵng', 4),
    (N'Trịnh Quý Thiện', N'0395075100', N'K318/17 Tôn Đản', N'Hòa An', N'Cẩm Lệ', N'Đà Nẵng', 5),
    (N'Siêu thị Điện Máy Xanh', N'02366554477', N'100 Lê Lợi', N'Thạch Thang', N'Hải Châu', N'Đà Nẵng', 6),
    (N'Điện nước Việt Nam', N'02366553388', N'22 Phan Đình Phùng', N'Hải Châu 1', N'Hải Châu', N'Đà Nẵng', 7),
    (N'Nguyễn Văn A', N'0905123456', N'40 Bạch Đằng', N'Thạch Thang', N'Hải Châu', N'Đà Nẵng', 8),
    (N'Nguyễn Văn B', N'0935678901', N'75 Trần Phú', N'Hải Châu 1', N'Hải Châu', N'Đà Nẵng', 9);

INSERT INTO `system_reports` (`report_description`, `user_id`) VALUES
    (N'Hệ thống đang hoạt động ổn định', 9),
    (N'Phát hiện lỗi nhỏ ở hệ thống quản lý đơn hàng', 7);

INSERT INTO `services` (`service_name`, `service_description`, `owner_id`) VALUES
    (N'Sửa chữa điện lạnh', N'Dịch vụ sửa chữa tủ lạnh, máy lạnh tại nhà', 6),
    (N'Lắp đặt máy nước nóng', N'Dịch vụ lắp đặt, bảo trì máy nước nóng', 7),
    (N'Bảo trì điện nước', N'Dịch vụ sửa chữa, lắp đặt điện nước tại nhà', 7);

INSERT INTO `employees` (`employee_full_name`, `owner_id`) VALUES
    (N'Trần Văn Công', 6),
    (N'Phạm Quốc Dũng', 6),
    (N'Lê Thị Hồng', 7);

INSERT INTO `orders` (`order_description`, `store_address`, `customer_address`, `order_status`, `customer_id`, `service_id`, `employee_id`) VALUES
    (N'Sửa tủ lạnh Toshiba tại nhà', N'100 Lê Lợi, Hải Châu, Đà Nẵng', N'40 Bạch Đằng, Hải Châu, Đà Nẵng', N'PROCESSING', 8, 1, 1),
    (N'Lắp đặt máy nước nóng Ariston', N'22 Phan Đình Phùng, Thanh Khê, Đà Nẵng', N'75 Trần Phú, Sơn Trà, Đà Nẵng', N'COMPLETED', 9, 2, 3),
    (N'Kiểm tra tủ lạnh', N'22 Phan Đình Phùng, Thanh Khê, Đà Nẵng', N'75 Trần Phú, Sơn Trà, Đà Nẵng', N'CANCELLED', 8, 3, 2),
    (N'Kiểm tra hệ thống điện tại nhà', N'22 Phan Đình Phùng, Thanh Khê, Đà Nẵng', N'75 Trần Phú, Sơn Trà, Đà Nẵng', N'PENDING', 8, 3, NULL);
