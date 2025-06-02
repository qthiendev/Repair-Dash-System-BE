const { Service } = require("../../models/index.model");
const { Op } = require("sequelize");
const uploadMedia = require("../cloudinary/uploadMedia.service");
const terminal = require("../../../utils/terminal");

module.exports = async (
	owner_id,
	service_id,
	service_name,
	service_description,
	service_image,
	service_alias,
) => {
	const service = await Service.findOne({
		where: { owner_id, service_id, delete_flag: false },
	});

	if (!service) {
		return -1;
	}

	if (service_alias) {
		const existAlias = await Service.findOne({
			where: {
				service_alias,
				delete_flag: false,
				service_id: { [Op.ne]: service_id },
			},
		});

		if (existAlias) {
			terminal.warning(
				`service.service.js | Alias already exists: ${service_alias}`,
			);
			return -2;
		}
	}

	if (service_image) {
		service_image = await uploadMedia.uploadImage(
			`service_${service_id}`,
			service_image,
		);
	}

	const updateData = {
		service_name,
		service_description,
		service_image_url: service_image,
		updated_at: new Date(),
	};

	if (service_alias !== null) {
		updateData.service_alias = service_alias;
	}

	await Service.update(updateData, {
		where: { owner_id, service_id, delete_flag: false },
	});

	const updatedService = await Service.findOne({
		where: {
			owner_id,
			service_id,
			delete_flag: false,
		},
		raw: true,
		nest: true,
	});

	return updatedService;
};
