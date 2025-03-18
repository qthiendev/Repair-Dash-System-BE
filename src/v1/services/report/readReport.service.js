const { SystemReport, User } = require("../../models/index.model");
const retrieveMedia = require("../cloudinary/retrieveMedia.service");

module.exports = async (report_id, user_id, index = 1, limit = 10) => {
  if (report_id && user_id) {
    const report = await SystemReport.findOne({
      where: { report_id, user_id, delete_flag: false },
      include: {
        model: User,
        as: "reporter",
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

    return report
      ? report.toJSON()
      : { message: "Report not found", error: -1 };
  }

  const totalItems = await SystemReport.count({
    where: { user_id, delete_flag: false },
  });
  const totalPages = Math.ceil(totalItems / limit);
  const offset = (index - 1) * limit;

  const reports = await SystemReport.findAll({
    where: { user_id, delete_flag: false },
    limit,
    offset,
    order: [["report_id", "DESC"]],
    include: {
      model: User,
      as: "reporter",
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

  return {
    message: "Report list retrieved successfully",
    listReport: reports.map((report) => report.toJSON()),
    limit,
    index,
    totalPages,
  };
};
