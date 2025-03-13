const { Service, User } = require("../../models/index.model");

module.exports = async (service_id) => {
  if (service_id) {
    return await Service.findOne({
      where: {
        service_id,
        delete_flag: false,
      },
      include: {
        model: User,
        as: "owner",
        attributes: ["user_full_name"],
      },
    });
  }

  return await Service.findAll({
    where: {
      delete_flag: false,
    },
    include: {
      model: User,
      as: "owner",
      attributes: ["user_full_name"],
    },
  });
};
