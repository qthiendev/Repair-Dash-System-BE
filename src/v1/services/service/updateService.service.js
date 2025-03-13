const { Service } = require("../../models/index.model");

module.exports = async (owner_id, service_id, service_name, service_description) => {
  if (
    !(await Service.findOne({
      where: { owner_id, service_id, delete_flag: false },
    }))
  ) {
    return -1;
  }

  const [updatedRows] = await Service.update(
    { service_name, service_description, updated_at: new Date() },
    {
      where: {
        owner_id,
        service_id,
        delete_flag: false,
      },
    }
  );

  return updatedRows > 0;
};
