const getRTCSession = require("../services/rtc/getRTCSession.service");
const updateRTCSession = require("../services/rtc/updateRTCSession.service");
const jwt = require("jsonwebtoken");
const terminal = require("../../utils/terminal");

exports.getSession = async (req, res) => {
	try {
		const user_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;
		const { session_id } = req.params;

		const session = await getRTCSession(user_id, session_id);

		switch (session) {
			case -1:
				return res
					.status(404)
					.json({ success: false, message: "Session not found" });
			default:
				return res.status(200).json({ success: true, session });
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to retrieve session",
			error: error.message,
		});
	}
};

exports.updateSession = async (req, res) => {
	try {
		const user_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;
		const { session_id } = req.params;
		const { message } = req.body;

		const session = await updateRTCSession(user_id, session_id, message);

		switch (session) {
			case -1:
				return res
					.status(404)
					.json({ success: false, message: "Session not found" });
			default:
				return res.status(200).json({ success: true, session });
		}
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to update session",
			error: error.message,
		});
	}
};
