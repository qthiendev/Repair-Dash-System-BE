const { SystemReport } = require("../../models/index.model");

module.exports = async (report_id, user_id) => {
	const report = await SystemReport.findOne({
		where: {
			report_id,
			user_id,
			delete_flag: false,
		},
	});

	if (!report) {
		return -1;
	}

	const [updatedRows] = await SystemReport.update(
		{
			delete_flag: true,
			updated_at: new Date(),
		},
		{
			where: { report_id, user_id },
		},
	);

	return updatedRows > 0;
};
