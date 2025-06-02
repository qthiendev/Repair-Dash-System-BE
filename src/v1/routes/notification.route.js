const express = require("express");
const router = express.Router();

const { getNotifications } = require("../controllers/notification.controller");

const { authenticate } = require("../middlewares/auth.middleware");

/**
 * @description Notification-related API endpoints.
 *
 * @route GET  /api/v1/notifications           - Get paginated notifications
 */
router.get("/", authenticate, getNotifications);

module.exports = router;
