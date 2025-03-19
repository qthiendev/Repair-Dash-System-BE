const createReport = require("../services/report/createReport.service");
const readReport = require("../services/report/readReport.service");
const readReportAdmin = require("../services/report/readReportAdmin.service");
const deleteReport = require("../services/report/deleteReport.service");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Create a new report.
 * @route POST /api/v1/report
 * @body {string} report_description -(required)
 * @body {file} report_images (optional)
 * @returns {Object} 201 - { report_id: number } if created successfully
 * @returns {Object} 400 - { message: 'Report already exists' } if the report is already registered
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } if an internal error happens
 */
exports.createReport = async (req, res) => {
  try {
    const user_id = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET_KEY
    ).user_id;

    const { report_description, report_images } = req.body;

    const reportId = await createReport(
      user_id,
      report_description,
      report_images
    );

    switch (reportId) {
      case -1:
        return res.status(400).json({ message: "User not found.", code: -1 });
      case -2:
        return res
          .status(400)
          .json({ message: "Report already exists.", code: -2 });
      default:
        return res
          .status(201)
          .json({ message: "Report created successfully", reportId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Retrieve report(s).
 * @route GET /api/v1/report/:report_id?
 * @param {string} [service_id] - (Optional) The ID of the report to retrieve. If omitted, returns all user's report.
 * @returns {Object} 200 - { data: reports } if report are found
 * @returns {Object} 404 - { message: 'Report not found' } if no service matches the given ID
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal server errors
 */
exports.readReport = async (req, res) => {
  try {
    const { report_id } = req.params;

    const user_id = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET_KEY
    ).user_id;

    const reports = await readReport(report_id, user_id);

    if (!reports) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({ data: reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Retrieve report(s).
 * @route GET /api/v1/report/admin/:report_id?
 * @param {string} [service_id] - (Optional) Returns all reports.
 * @returns {Object} 200 - { data: reports } if report are found
 * @returns {Object} 404 - { message: 'Reports not found' } if no service matches the given ID
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal server errors
 */
exports.readReportAdmin = async (req, res) => {
  try {
    const { report_id } = req.params;

    const reports = await readReportAdmin(report_id);

    if (!reports) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({ data: reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};

/**
 * Soft delete a report (marks the report as inactive instead of permanent deletion).
 * @route DELETE /api/v1/report/:report_id
 * @param {string} report_id - The ID of the service to delete.
 * @returns {Object} 200 - { message: 'Report deleted successfully' } if the report was found and marked as deleted
 * @returns {Object} 404 - { message: 'Report not found' } if no report with the given ID exists
 * @returns {Object} 501 - { message: 'Cannot delete report' } if the service was not deleted
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.deleteReport = async (req, res) => {
  try {
    const user_id = jwt.verify(
      req.cookies?.accessToken,
      process.env.JWT_SECRET_KEY
    ).user_id;

    const { report_id } = req.params;

    const result = await deleteReport(report_id, user_id);

    if (result === -1) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (!result) {
      return res.status(501).json({ message: "Cannot delete report" });
    }

    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unexpected error occurred" });
  }
};
