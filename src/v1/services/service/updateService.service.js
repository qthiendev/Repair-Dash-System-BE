const { Service } = require("../../models/index.model");
const uploadMedia = require("../cloudinary/uploadMedia.service");
const deleteMedia = require("../cloudinary/deleteMedia.service");

module.exports = async (
  owner_id,
  service_id,
  service_name,
  service_description,
  service_images
) => {
  if (
    !(await Service.findOne({
      where: { owner_id, service_id, delete_flag: false },
    }))
  ) {
    return -1;
  }

  if (service_images) {
    service_images = await uploadMedia.uploadImages(
      `service_${service_id}`,
      service_images
    );
  } else {
    await deleteMedia.deleteImages(`order_${service_id}`);
    updateFields.order_images_url = null;
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

  return updatedRows > 0;
};
