const { Service } = require("../../models/index.model");

module.exports = async (service_id) => {
  if (service_id) {
    return await Service.findOne({
      where: {
        service_id,
        delete_flag: false,
      },
    });
  }

  return await Service.findAll({
    where: {
      delete_flag: false,
    },
  });
};
