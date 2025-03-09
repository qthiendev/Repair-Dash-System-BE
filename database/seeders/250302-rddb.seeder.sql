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
    (N'nguyenthanhnhan110503@gmail.com', N'$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', N'ADMIN'),
    (N'dangvannho7@gmail.com', N'$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', N'ADMIN'),
    (N'truong10032k@gmail.com', N'$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', N'ADMIN'),
    (N'addnguyen32@gmail.com', N'$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', N'ADMIN'),
    (N'trinhquythien.dev@gmail.com', N'$2a$12$jKvZAj1sovvg5O2DcZZw3OJ3R2YHWDcggcu9i2ojFQ0iKDd6x91jq', N'ADMIN'),
    (N'dienmayxanh@gmail.com', N'$2a$12$bA1Lz622MidYK3PRV1bxyeIiPTQcrhbIiEfmUZWRX.IbHGsR0ebqG', N'STORE'),
    (N'decseize4work@gmail.com', N'$2a$12$bA1Lz622MidYK3PRV1bxyeIiPTQcrhbIiEfmUZWRX.IbHGsR0ebqG', N'STORE'),
    (N'nguyenvana@example.com', N'$2a$12$vV8XlRlcufSGicGkBoptceuM5nr5BjTToor8Bf/zT3OVLr9XTEpjq', N'CUSTOMER'),
    (N'nguyenvanb@example.com', N'$2a$12$vV8XlRlcufSGicGkBoptceuM5nr5BjTToor8Bf/zT3OVLr9XTEpjq', N'CUSTOMER');

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

INSERT INTO `orders` (
    `order_description`, 
    `order_status`, 
    `order_feedback`, 
    `service_name`,
    `service_description`,
    `store_full_name`, 
    `store_address`, 
    `store_phone_number`,
    `employee_full_name`,
    `customer_full_name`, 
    `customer_phone_number`, 
    `customer_address`, 
    `service_id`, 
    `employee_id`, 
    `customer_id`
) VALUES
    (N'Sửa tủ lạnh Toshiba, mua cách đây 3 năm', N'PROCESSING', NULL, N'Sửa chữa điện lạnh', N'Dịch vụ sửa chữa tủ lạnh, máy lạnh tại nhà', N'Siêu thị Điện Máy Xanh', N'100 Lê Lợi, Hải Châu, Đà Nẵng', N'02366554477', N'Trần Văn Công', N'Nguyễn Văn A', N'0905123456', N'40 Bạch Đằng, Hải Châu, Đà Nẵng', 1, 1, 8),
    (N'Lắp đặt máy nước nóng Ariston', N'COMPLETED', N'Lắp đặt thành công, không có phụ phí', N'Lắp đặt máy nước nóng', N'Dịch vụ lắp đặt, bảo trì máy nước nóng', N'Điện nước Việt Nam', N'22 Phan Đình Phùng, Thanh Khê, Đà Nẵng', N'02366553388', N'Phạm Quốc Dũng', N'Nguyễn Văn B', N'0935678901', N'75 Trần Phú, Sơn Trà, Đà Nẵng', 2, 3, 9),
    (N'[Khách hàng hủy đơn]', N'CANCELLED', N'Cửa hàng không nhận đơn', N'Bảo trì điện nước', N'Dịch vụ sửa chữa, lắp đặt điện nước tại nhà', N'Điện nước Việt Nam', N'22 Phan Đình Phùng, Thanh Khê, Đà Nẵng', N'02366553388', N'Lê Thị Hồng', N'Nguyễn Văn A', N'0905123456', N'75 Trần Phú, Sơn Trà, Đà Nẵng', 3, 2, 8),
    (N'Kiểm tra hệ thống điện tại nhà', N'PENDING', NULL, N'Bảo trì điện nước', N'Dịch vụ sửa chữa, lắp đặt điện nước tại nhà', N'Điện nước Việt Nam', N'22 Phan Đình Phùng, Thanh Khê, Đà Nẵng', N'02366553388', NULL, N'Nguyễn Văn A', N'0905123456', N'75 Trần Phú, Sơn Trà, Đà Nẵng', 3, NULL, 8);
