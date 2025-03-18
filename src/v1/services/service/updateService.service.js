const { Service } = require("../../models/index.model");
const uploadMedia = require("../cloudinary/uploadMedia.service");
const deleteMedia = require("../cloudinary/deleteMedia.service");

module.exports = async (
  owner_id,
  service_id,
  service_name,
  service_description,
  service_images,
  index = 1,
  limit = 10
) => {
  const existingService = await Service.findOne({
    where: { owner_id, service_id, delete_flag: false },
  });

  if (!existingService) {
    return { success: false, message: "Service not found" };
  }

  if (service_images) {
    service_images = await uploadMedia.uploadImages(
      `service_${service_id}`,
      service_images
    );
  } else {
    await deleteMedia.deleteImages(`service_${service_id}`);
    service_images = null;
  }

  const [updatedRows] = await Service.update(
    {
      service_name,
      service_description,
      service_images_url: service_images,
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

  if (updatedRows === 0) {
    return { success: false, message: "No changes made" };
  }

  const updatedService = await Service.findOne({
    where: { owner_id, service_id, delete_flag: false },
  });

  const totalItems = await Service.count({
    where: { owner_id, delete_flag: false },
  });
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (index - 1) * limit;

  const services = await Service.findAll({
    where: { owner_id, delete_flag: false },
    limit,
    offset,
    order: [["service_id", "DESC"]],
  });

  return {
    message: "Service updated successfully",
    updatedService: updatedService.toJSON(),
    listService: services,
    limit,
    index,
    totalPages,
  };
};
