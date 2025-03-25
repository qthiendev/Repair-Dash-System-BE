const { User, Service } = require("../../models/index.model");

module.exports = async (user_id) => {
  if (user_id) {
    const profile = await User.findOne({
      where: {
        user_id,
        delete_flag: false,
      },
      attributes: { exclude: ["user_priority"] },
      include: {
        model: Service,
        as: "services",
        attributes: [
          "service_name",
          "service_description",
          "service_image_url",
        ],
      },
    });

    if (!profile) {
      return -1;
    }

    return {
      message: "Service retrieved successfully",
      profile: profile.toJSON(),
    };
  }
};
