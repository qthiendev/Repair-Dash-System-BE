const { User } = require("../../models/index.model");
const uploadMedia = require("../cloudinary/uploadMedia.service");

module.exports = async (
  user_id,
  user_full_name,
  user_phone_number,
  user_avatar,
  user_description,
  user_street,
  user_ward,
  user_district,
  user_city
) => {
  if (
    !(await User.findOne({
      where: { user_id, delete_flag: false },
    }))
  ) {
    return -1;
  }

  if (user_avatar) {
    user_avatar = await uploadMedia.uploadImage(`user_${user_id}`, user_avatar);
  }
  const [updatedRows] = await User.update(
    {
      user_full_name,
      user_phone_number,
      user_avatar_url: user_avatar,
      user_description,
      user_street,
      user_ward,
      user_district,
      user_city,
    },
    {
      where: {
        user_id,
        delete_flag: false,
      },
    }
  );

  const updateProfile = await User.findOne({
    where: { user_id, delete_flag: false },
    attributes: { exclude: ["user_priority"] },
  });

  return updateProfile;
};
