const { User, Service, Authentication } = require("../../models/index.model");

module.exports = async (user_id, current_page = 1, limit = 10) => {
  if (!user_id) return -1;

  const totalItems = await Service.count({
    where: { delete_flag: false, owner_id: user_id },
  });
  const total_pages = Math.ceil(totalItems / limit);
  const offset = (current_page - 1) * limit;

  const profile = await User.findOne({
    where: {
      user_id,
      delete_flag: false,
    },
    attributes: { exclude: ["user_priority"] },
    include: [
      {
        model: Authentication,
        as: "authentication",
        attributes: ["role", "identifier_email"],
      },
    ],
    raw: true,
    nest: true,
  });

  if (!profile) return -1;

  const services = await Service.findAll({
    where: { owner_id: user_id, delete_flag: false },
    attributes: [
      "service_id",
      "service_name",
      "service_alias",
      "service_description",
      "service_image_url",
      "created_at",
      "updated_at",
    ],
    limit,
    offset,
    order: [["created_at", "DESC"]],
    raw: true,
    nest: true,
  });

  return {
    message: "Service retrieved successfully",
    profile: {
      ...profile,
      services,
    },
    total_pages,
    current_page,
  };
};
