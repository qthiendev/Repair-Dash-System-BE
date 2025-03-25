const { Service, User, Order } = require("../../models/index.model");
const retrieveMedia = require("../cloudinary/retrieveMedia.service");

module.exports = async (service_id, current_page = 1, limit = 10) => {
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
      return -1;
    }

    const orders = service.orders || [];

    const validOrders = service.orders.filter(
      (order) => order.order_feedback !== null && order.order_rating !== null
    );

    const totalReviews = validOrders.length;

    const totalStars = orders.reduce(
      (sum, order) => sum + (order.order_rating || 0),
      0
    );
    const averageRating =
      totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : null;

    return {
      message: "Service retrieved successfully",
      service: service.toJSON(),
      totalReviews,
      averageRating,
    };
  }

  const totalItems = await Service.count({ where: { delete_flag: false } });
  const total_pages = Math.ceil(totalItems / limit);
  const offset = (current_page - 1) * limit;

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
