const { SystemReport, User } = require("../../models/index.model");
const uploadMedia = require("../cloudinary/uploadMedia.service");
const terminal = require("../../../utils/terminal");

module.exports = async (
  user_id,
  report_description,
  report_images,
  index = 1,
  limit = 10
) => {
  const user = await User.findByPk(user_id);

  if (!user) {
    terminal.warning(`services.report.js | User ${user_id} not found.`);
    return { success: false, message: "User not found" };
  }

  const existingReport = await SystemReport.findOne({
    where: { report_description, user_id },
  });

  if (existingReport) {
    terminal.warning(`services.report.js | Report already exists.`);
    return { success: false, message: "Report already exists" };
  }

  const newReport = await SystemReport.create({
    report_description,
    user_id,
  });

  let fileUrl = null;
  if (report_images) {
    fileUrl = await uploadMedia.uploadImage(
      `report_${newReport.report_id}`,
      report_images
    );
    await SystemReport.update(
      { report_image_url: fileUrl },
      { where: { report_id: newReport.report_id } }
    );
  }

  return newReport.report_id;
};
