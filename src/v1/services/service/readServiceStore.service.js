const { Service, User } = require("../../models/index.model");
const retrieveMedia = require("../cloudinary/retrieveMedia.service");

module.exports = async (owner_id, current_page = 1, limit = 10) => {
  const totalItems = await Service.count({
    where: { owner_id, delete_flag: false },
  });
  const total_pages = Math.ceil(totalItems / limit);
  const offset = (current_page - 1) * limit;

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
    order: [["service_id", "DESC"]],
  });

  return {
    message: "Services retrieved successfully",
    listService: services.map((service) => service.toJSON()),
    limit,
    current_page,
    total_pages,
  };
};
