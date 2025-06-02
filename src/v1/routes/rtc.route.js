const express = require("express");
const router = express.Router();

const { getSession, updateSession } = require("../controllers/rtc.controller");

const {
	readSessionValidation,
	updateSessionValidation,
} = require("../validators/rtc.validator");

/**
 * @description Real-time chat (RTC) API endpoints.
 *
 * @route GET  /v1/rtc/:session_id  - Retrieve chat messages for a session
 * @route POST /v1/rtc/:session_id  - Send a message within a chat session
 */
router.get("/:session_id", readSessionValidation, getSession);
router.post("/:session_id", updateSessionValidation, updateSession);

module.exports = router;
