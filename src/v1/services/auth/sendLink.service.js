const sendMailHelper = require("../../utils/sendMail");
const link = require("../../../configs/redis.config");
const { Authentication } = require("../../models/index.model");
require("dotenv").config();

module.exports = async (email) => {
	const findEmail = await Authentication.findOne({
		where: { identifier_email: email },
	});
	if (!findEmail) {
		return -1;
	}
	const generateRandomNumber = (length) => {
		const characters = "0123456789";
		let result = "";
		for (let i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * characters.length),
			);
		}
		return result;
	};

	const otp = generateRandomNumber(6);

	await link.setEx(`otp:${email}`, 300, otp);

	if (findEmail) {
		const subject = "Rest Password";
		const html = `Link rest password là <b>${otp}</b>. `;

		sendMailHelper.sendMail(email, subject, html);

		return 1;
	} else {
		return "Email not find";
	}
};
