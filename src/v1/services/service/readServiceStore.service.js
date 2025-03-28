const { Service, User, Order } = require("../../models/index.model");
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

  const userInclude = {
    model: User,
    as: "owner",
    attributes: [],
    ...(owner_id && {
      where: {
        [Op.or]: [{ user_id: owner_id }, { user_alias: owner_id }],
      },
    }),
  };

  const totalItems = await Service.count({
    where: whereCondition,
    include: [userInclude],
  });

  const total_pages = Math.ceil(totalItems / limit);
  const offset = (current_page - 1) * limit;

  const services = await Service.findAll({
    where: whereCondition,
    include: [
      userInclude,
      {
        model: Order,
        as: "orders",
        attributes: ["customer_full_name", "order_feedback", "order_rating"],
        where: {
          order_feedback: { [Op.ne]: null },
          order_rating: { [Op.ne]: null },
        },
        required: false,
      },
    ],
    limit,
    offset,
    order: [["service_id", "DESC"]],
    raw: false,
    nest: true,
  });

  const services_with_ratings = services.map((service) => {
    const orders = Array.isArray(service.orders)
      ? service.orders
      : service.orders
      ? [service.orders]
      : [];

    const total_reviews = orders.length;
    const totalStars = orders.reduce(
      (sum, order) => sum + (order.order_rating || 0),
      0
    );

    return {
      ...service.get({ plain: true }),
      average_rating:
        total_reviews > 0 ? (totalStars / total_reviews).toFixed(1) : null,
    };
  });

  return {
    services: services_with_ratings,
    limit,
    current_page,
    total_pages,
  };
};
