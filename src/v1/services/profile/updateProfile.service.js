const { User } = require("../../models/index.model");
const { Op } = require("sequelize");
const uploadMedia = require("../cloudinary/uploadMedia.service");

module.exports = async (
	user_id,
	user_full_name,
	user_alias,
	user_phone_number,
	user_avatar,
	user_description,
	user_street,
	user_ward,
	user_district,
	user_city,
) => {
	const user = await User.findOne({
		where: { user_id, delete_flag: false },
	});

	if (!user) {
		return -1;
	}

	if (user_alias) {
		const existingAlias = await User.findOne({
			where: {
				user_alias,
				delete_flag: false,
				user_id: { [Op.ne]: user_id },
			},
			raw: true,
			nest: true,
		});

		if (existingAlias) {
			return -2;
		}
	}

	if (user_avatar) {
		user_avatar = await uploadMedia.uploadImage(
			`user_${user_id}`,
			user_avatar,
		);
	}

	const updateData = {
		user_full_name,
		user_phone_number,
		user_avatar_url: user_avatar,
		user_description,
		user_street,
		user_ward,
		user_district,
		user_city,
		user_alias,
	};

	await User.update(updateData, {
		where: { user_id, delete_flag: false },
	});

	const updatedProfile = await User.findOne({
		where: { user_id, delete_flag: false },
		attributes: { exclude: ["user_priority"] },
		raw: true,
		nest: true,
	});

	return updatedProfile;
};
