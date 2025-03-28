const { Service, User } = require("../../models/index.model");
const { Op } = require("sequelize");

module.exports = async (owner_id, current_page = 1, limit = 10) => {
  const whereCondition = {
    delete_flag: false,
  };

  if (owner_id) {
    whereCondition[Op.or] = [
      { owner_id: owner_id },
      { "$owner.user_alias$": owner_id },
    ];
  }

  const totalItems = await Service.count({
    where: whereCondition,
    include: [
      {
        model: User,
        as: "owner",
        attributes: [],
      },
    ],
  });

  const total_pages = Math.ceil(totalItems / limit);
  const offset = (current_page - 1) * limit;

  const services = await Service.findAll({
    where: whereCondition,
    include: [
      {
        model: User,
        as: "owner",
        attributes: [],
      },
    ],
    limit,
    offset,
    order: [["service_id", "DESC"]],
  });

  return {
    listService: services.map((service) => service.toJSON()),
    limit,
    current_page,
    total_pages,
  };
};
