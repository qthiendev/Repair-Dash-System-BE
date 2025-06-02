const express = require("express");
const router = express.Router();

const {
	createZaloPay,
	checkZaloPay,
	getSubscription,
} = require("../controllers/payment.controller");
const {
	createZaloPayValidation,
	checkZaloPayValidation,
} = require("../validators/payment.validator");
const {
	authenticate,
	ensureStore,
	ensureAdmin,
} = require("../middlewares/auth.middleware");

/**
 * @description ZaloPay-related API endpoints.
 *
 * @route POST /api/v1/payment/zalopay - Create a ZaloPay payment request
 * @route GET  /api/v1/payment/zalopay/:trans_id - Check ZaloPay transaction status
 */

// Requires user to be authenticated
router.post(
	"/zalopay",
	authenticate,
	ensureStore,
	createZaloPayValidation,
	createZaloPay,
);
router.put(
	"/zalopay/:trans_id",
	authenticate,
	ensureStore,
	checkZaloPayValidation,
	checkZaloPay,
);
router.get(
	"/zalopay/:trans_id",
	authenticate,
	ensureStore,
	checkZaloPayValidation,
	getSubscription,
);
router.get("/zalopay/", authenticate, ensureAdmin, getSubscription);

module.exports = router;
