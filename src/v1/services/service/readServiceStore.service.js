const { Service, User } = require("../../models/index.model");
const retrieveMedia = require("../cloudinary/retrieveMedia.service");

module.exports = async (owner_id, index = 1, limit = 10) => {
  // Đếm tổng số dịch vụ để tính totalPages
  const totalItems = await Service.count({
    where: { owner_id, delete_flag: false },
  });
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (index - 1) * limit;

  // Lấy danh sách dịch vụ theo phân trang
  const services = await Service.findAll({
    where: {
      owner_id,
      delete_flag: false,
    },
    include: [
      {
        model: User,
        as: "owner",
        attributes: [
          "user_full_name",
          "user_street",
          "user_ward",
          "user_district",
          "user_city",
          "user_phone_number",
        ],
      },
    ],
    limit,
    offset,
    order: [["service_id", "DESC"]], // Sắp xếp từ lớn đến nhỏ
  });

  const listService = await Promise.all(
    services.map(async (service) => {
      const service_images = await retrieveMedia.getImages(
        service.service_images_url
      );
      return { ...service.toJSON(), service_images_url: service_images };
    })
  );

  return {
    message: "Services retrieved successfully",
    listService,
    limit,
    index,
    totalPages,
  };
};
