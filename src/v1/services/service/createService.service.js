const { Service, User } = require("../../models/index.model");
const terminal = require("../../../utils/terminal");

module.exports = async (owner_id, service_name, service_description) => {
  const owner = await User.findByPk(owner_id);

  if (!owner) {
    terminal.warning(`service.service.js | Owner ${owner_id} not found.`);
    return -1;
  }

  const service = await Service.findOne({
    where: {
      service_name: service_name,
      owner_id: owner_id,
    },
  });

  if (service) {
    terminal.warning(`service.service.js | Service had existed.`);
    return -2;
  }

  const newService = await Service.create({
    service_name,
    service_description,
    owner_id: owner_id,
  });

  return newService.service_id;
};
