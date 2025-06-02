const express = require("express");
const router = express.Router();

const {
	createReport,
	readReport,
	readReportAdmin,
	deleteReport,
} = require("../controllers/report.controller");

const {
	createReportValidation,
	readReportValidation,
	deleteReportValidation,
} = require("../validators/report.validator");

const {
	authenticate,
	ensureCustomer,
	ensureAdmin,
} = require("../middlewares/auth.middleware");

/**
 * @description RESTful API for managing report.
 *
 * @route POST   /v1/report          - Create a new report
 * @route GET    /v1/report/:report_id? - Retrieve all report or a specific report
 * @route GET    /v1/report/admin/:report_id? - Retrieve all report
 * @route DELETE /v1/report/:report_id  - Soft delete a report
 */
router.post("/", authenticate, createReportValidation, createReport);
router.get(
	"/admin/:report_id?",
	authenticate,
	ensureAdmin,
	readReportValidation,
	readReportAdmin,
);
router.get(
	"/:report_id?",
	authenticate,
	ensureCustomer,
	readReportValidation,
	readReport,
);
router.delete(
	"/:report_id",
	authenticate,
	ensureCustomer,
	deleteReportValidation,
	deleteReport,
);

module.exports = router;
