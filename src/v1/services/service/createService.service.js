const { Service, User } = require("../../models/index.model");
const uploadMedia = require("../cloudinary/uploadMedia.service");
const terminal = require("../../../utils/terminal");

module.exports = async (
  owner_id,
  service_name,
  service_description,
  service_image,
  service_alias
) => {
  const owner = await User.findByPk(owner_id);

  if (!owner) {
    terminal.warning(`service.service.js | Owner ${owner_id} not found.`);
    return -1;
  }

  const service = await Service.findOne({
    where: {
      service_name: service_name,
      owner_id: owner_id,
      delete_flag: false,
    },
  });

  if (service) {
    terminal.warning(`service.service.js | Service had existed.`);
    return -2;
  }

  const existAlias = await Service.findOne({
    where: { service_alias },
    delete_flag: false,
  });

  if (existAlias) {
    terminal.warning(`service.service.js | Alias had existed.`);
    return -3;
  }

  const newService = await Service.create({
    service_name,
    service_description,
    service_alias,
    owner_id: owner_id,
  });

  let fileUrl = null;

  if (service_image) {
    fileUrl = await uploadMedia.uploadImage(
      `service_${newService.service_id}`,
      service_image
    );
    await Service.update(
      { service_image_url: fileUrl },
      { where: { service_id: newService.service_id } }
    );
  }

  return newService.service_id;
};
