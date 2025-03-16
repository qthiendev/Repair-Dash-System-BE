const { Service, User } = require("../../models/index.model");
const retrieveMedia = require("../cloudinary/retrieveMedia.service");

module.exports = async (owner_id) => {
  const services = await Service.findAll({
    where: {
      owner_id,
      delete_flag: false,
    },
    include: {
      model: User,
      as: "owner",
      attributes: [
        "user_full_name",
        "user_street",
        "user_ward",
        "user_district",
        "user_city",
        "user_phone_number",
      ],
    },
  });

  return await Promise.all(
    services.map(async (service) => {
      const service_images = await retrieveMedia.getImages(
        service.service_images_url
      );
      return { ...service.toJSON(), service_images_url: service_images };
    })
  );
};
