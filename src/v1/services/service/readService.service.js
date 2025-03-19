const { Service, User, Order } = require("../../models/index.model");
const retrieveMedia = require("../cloudinary/retrieveMedia.service");

module.exports = async (service_id, index = 1, limit = 10) => {
  if (service_id) {
    const service = await Service.findOne({
      where: {
        service_id,
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
        {
          model: Order,
          as: "orders",
          attributes: ["customer_full_name", "order_feedback", "order_rating"],
        },
      ],
    });

    if (!service) {
      return { message: "Service not found", success: false };
    }

    const service_images = await retrieveMedia.getImages(
      service.service_images_url
    );
    return {
      message: "Service retrieved successfully",
      service: { ...service.toJSON(), service_images_url: service_images },
    };
  }

  // Pagination setup
  const totalItems = await Service.count({ where: { delete_flag: false } });
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (index - 1) * limit;

  const services = await Service.findAll({
    where: {
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
