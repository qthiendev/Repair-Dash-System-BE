const express = require('express');
const router = express.Router();

const { readServiceReport, getUserStatistics } = require('../controllers/reports.controller');
const { readServiceReportValidation, getUserStatisticsValidation } = require('../validators/reports.validator');
const { authenticate, ensureStore, ensureAdmin } = require('../middlewares/auth.middleware');

/**
 * @description Service report endpoint for store users.
 * @route GET /api/v1/services/report/:service_id? - Get service report for store user
 */
router.get('/services/:service_id?', authenticate, ensureStore, readServiceReportValidation, readServiceReport);

/**
 * @description User statistics endpoint for admin users.
 * @route GET /api/v1/users/statistics - Get user statistics report
 */
router.get('/users', authenticate, ensureAdmin, getUserStatisticsValidation, getUserStatistics);

module.exports = router;
