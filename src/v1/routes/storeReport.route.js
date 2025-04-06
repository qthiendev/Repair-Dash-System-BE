const express = require('express');
const router = express.Router();

const { readServiceReport } = require('../controllers/storeReport.controller');
const { readServiceReportValidation } = require('../validators/storeReport.validator');
const { authenticate, ensureStore } = require('../middlewares/auth.middleware');

/**
 * @description Service report endpoint for store users.
 *
 * @route GET /api/v1/services/report/:service_id? - Get service report for store user
 */
router.get('/services/:service_id?', authenticate, ensureStore, readServiceReportValidation, readServiceReport);

module.exports = router;
