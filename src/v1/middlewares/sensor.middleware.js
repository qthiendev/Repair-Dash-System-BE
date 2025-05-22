const fs = require("fs");
const path = require("path");
const terminal = require("../../utils/terminal");

/**
 * Middleware to block bad words from request body, query, and params.
 * Initializes once and compares tokenized input against a list of bad words.
 *
 * @param {import("express").Request} req - The HTTP request object
 * @param {import("express").Response} res - The HTTP response object
 * @param {import("express").NextFunction} next - The next middleware function
 */
exports.blockBadWords = (req, res, next) => {
	if (!exports.blockBadWords.combinedBadWords) {
		try {
			const badWordsDir = path.join(__dirname, "../utils/data/badWords");
			let allWords = [];

			fs.readdirSync(badWordsDir).forEach((file) => {
				if (file.endsWith(".json")) {
					try {
						const filePath = path.join(badWordsDir, file);
						const words = JSON.parse(fs.readFileSync(filePath, "utf-8"));
						allWords.push(...words.map((w) => w.toLowerCase()));
					} catch (err) {
						console.error(`Failed to parse ${file}:`, err);
					}
				}
			});

			exports.blockBadWords.combinedBadWords = new Set(allWords);
			terminal.success(
				`Bad words filter initialized with ${allWords.length} words`
			);
		} catch (err) {
			console.error("Failed to initialize bad words filter:", err);
			exports.blockBadWords.combinedBadWords = new Set();
		}
	}

	try {
		const combinedBadWords = exports.blockBadWords.combinedBadWords;

		const textToCheck = JSON.stringify({
			...req.body,
			...req.query,
			...req.params,
		}).toLowerCase();

		const wordsInRequest = textToCheck.split(/\W+/);

		const detectedBadWords = wordsInRequest.filter((word) =>
			combinedBadWords.has(word)
		);

		if (detectedBadWords.length > 0) {
			terminal.warning(
				`sensor.middleware.js | Inappropriate language detected in request: ${[...new Set(detectedBadWords)].join(", ")}`
			);
			return res.status(400).json({
				message: "Inappropriate language detected in request.",
			});
		}
	} catch (error) {
		terminal.error(`sensor.middleware.js | Error: ${error.message}`);
		return res.status(500).json({ message: "Unexpected error occurred." });
	}

	next();
};
