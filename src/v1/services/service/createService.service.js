const { Service, User } = require("../../models/index.model");
const uploadMedia = require("../cloudinary/uploadMedia.service");
const terminal = require("../../../utils/terminal");

module.exports = async (
  owner_id,
  service_name,
  service_description,
  service_images,
  index = 1,
  limit = 10
) => {
  const owner = await User.findByPk(owner_id);

  if (!owner) {
    terminal.warning(`service.service.js | Owner ${owner_id} not found.`);
    return { message: "Owner not found", error: -1 };
  }

  const service = await Service.findOne({
    where: {
      service_name: service_name,
      owner_id: owner_id,
    },
  });

  if (service) {
    terminal.warning(`service.service.js | Service had existed.`);
    return { message: "Service already exists", error: -2 };
  }

  const newService = await Service.create({
    service_name,
    service_description,
    owner_id: owner_id,
  });

  const folderUrl = await uploadMedia.uploadImages(
    `service_${newService.service_id}`,
    service_images
  );

  if (folderUrl) {
    await Service.update(
      { service_images_url: folderUrl },
      { where: { service_id: newService.service_id } }
    );
  }

  const totalItems = await Service.count({ where: { owner_id } });
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (index - 1) * limit;

  const services = await Service.findAll({
    where: { owner_id, delete_flag: false },
    limit,
    offset,
    order: [["service_id", "DESC"]],
  });

  return {
    message: "Service created successfully",
    newService: newService.toJSON(),
    listService: services,
    limit: limit,
    index: index,
    totalPages: totalPages,
  };
};
