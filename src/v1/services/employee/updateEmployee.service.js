const { Employee } = require("../../models/index.model");
const uploadMedia = require("../cloudinary/uploadMedia.service");
const deleteMedia = require("../cloudinary/deleteMedia.service");

module.exports = async (
	owner_id,
	employee_id,
	employee_full_name,
	avatar_image,
	current_page,
	limit = 10,
) => {
	if (
		!(await Employee.findOne({
			where: { owner_id, employee_id, delete_flag: false },
		}))
	) {
		return -1;
	}

	if (avatar_image) {
		avatar_image = await uploadMedia.uploadImage(
			`employee_${employee_id}`,
			avatar_image,
		);
	}
	const [updatedRows] = await Employee.update(
		{
			employee_full_name,
			employee_avatar_url: avatar_image,
			updated_at: new Date(),
		},
		{
			where: {
				owner_id,
				employee_id,
				delete_flag: false,
			},
		},
	);

	const updateEmployee = await Employee.findOne({
		where: { owner_id, employee_id, delete_flag: false },
	});

	return updateEmployee;
};
