const { Service, User, Order, Favorite } = require("../../models/index.model");
const { Op } = require("sequelize");

module.exports = async (service_id, user_id = null, current_page = 1, limit = 10) => {
  if (service_id) {
    const service = await Service.findOne({
      where: {
        [Op.or]: [{ service_id: service_id }, { service_alias: service_id }],
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
            "user_alias",
          ],
        },
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
    });

    if (!service) {
      return -1;
    }

    const orders = service.orders || [];
    const total_reviews = orders.length;
    const totalStars = orders.reduce(
      (sum, order) => sum + (order.order_rating || 0),
      0
    );
    const average_rating =
      total_reviews > 0 ? (totalStars / total_reviews).toFixed(1) : null;

    let favorite = null;
    if (user_id) {
      const favoriteRecord = await Favorite.findOne({
        where: {
          customer_id: user_id,
          service_id: service.service_id
        }
      });
      favorite = !!favoriteRecord;
    }

    return {
      message: "Service retrieved successfully",
      service: {
        ...service.get({ plain: true }),
        total_reviews,
        average_rating,
        favorite
      },
    };
  }

  const totalItems = await Service.count({ where: { delete_flag: false } });
  const total_pages = Math.ceil(totalItems / limit);
  const offset = (current_page - 1) * limit;

  const services = await Service.findAll({
    where: { delete_flag: false },
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
          "user_alias",
        ],
      },
    ],
    limit,
    offset,
    order: [["service_id", "DESC"]],
  });

  const servicesWithFavorites = await Promise.all(services.map(async (service) => {
    let favorite = null;
    if (user_id) {
      const favoriteRecord = await Favorite.findOne({
        where: {
          customer_id: user_id,
          service_id: service.service_id
        }
      });
      favorite = !!favoriteRecord;
    }
    return {
      ...service.get({ plain: true }),
      favorite
    };
  }));

  return {
    message: "Services retrieved successfully",
    services: servicesWithFavorites,
    limit,
    current_page,
    total_pages,
  };
};
