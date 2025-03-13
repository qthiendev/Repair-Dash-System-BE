const { Service } = require("../../models/index.model");

module.exports = async (service_id, owner_id) => {
  const service = await Service.findOne({
    where: {
      service_id,
      owner_id,
      delete_flag: false,
    },
  });

  if (!service) {
    return -1;
  }

  const [updatedRows] = await Service.update(
    {
      delete_flag: true,
      updated_at: new Date(),
    },
    {
      where: { service_id, owner_id },
    }
  );

  return updatedRows > 0;
};
