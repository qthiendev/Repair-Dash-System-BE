const { Service } = require("../../models/index.model");
const uploadMedia = require("../cloudinary/uploadMedia.service");
const deleteMedia = require("../cloudinary/deleteMedia.service");
const terminal = require("../../../utils/terminal");

module.exports = async (
  owner_id,
  service_id,
  service_name,
  service_description,
  service_image,
  service_alias
) => {
  if (
    !(await Service.findOne({
      where: { owner_id, service_id, delete_flag: false },
    }))
  ) {
    return -1;
  }

  const existAlias = await Service.findOne({
    where: { service_alias },
    delete_flag: false,
  });

  if (existAlias) {
    terminal.warning(`service.service.js | Alias had existed.`);
    return -2;
  }

  if (service_image) {
    service_image = await uploadMedia.uploadImage(
      `service_${service_id}`,
      service_image
    );
  }
  const [updatedRows] = await Service.update(
    {
      service_name,
      service_description,
      service_image_url: service_image,
      service_alias,
      updated_at: new Date(),
    },
    {
      where: {
        owner_id,
        service_id,
        delete_flag: false,
      },
    }
  );

  const updateService = await Service.findOne({
    where: { owner_id, service_id, delete_flag: false },
  });

  return updateService;
};
