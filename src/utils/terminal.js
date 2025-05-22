const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Logs a message to the console with color coding and writes it to a daily log file.
 *
 * Available types:
 * - info → White text
 * - error → Red text
 * - success → Green text
 * - running → Blue text
 * - warning → Yellow text
 * - debug → Magenta text
 */
const logToFile = (message, type = "info") => {
	const now = new Date();
	const datetime = now.toISOString().replace("T", " ").slice(0, 19);
	const logFilename = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}.log`;
	const logPath = path.join(logsDir, logFilename);

	const colors = {
		info: chalk.white,
		error: chalk.red,
		success: chalk.green,
		running: chalk.blue,
		warning: chalk.yellow,
		debug: chalk.magenta,
	};

	const typeColor = colors[type] || chalk.white;
	const datetimeColor = chalk.gray(datetime);
	const formattedMessage = `[${datetime}] ${message}`;

	console.log(`${datetimeColor} ${typeColor(message)}`);

	fs.appendFileSync(logPath, `${formattedMessage}\n`, "utf8");
};

module.exports = {
	/**
	 * Log an info message.
	 * @param {string} message - The message to log.
	 */
	info: (message) => logToFile(message, "info"),

	/**
	 * Log an error message.
	 * @param {string} message - The message to log.
	 */
	error: (message) => logToFile(message, "error"),

	/**
	 * Log a success message.
	 * @param {string} message - The message to log.
	 */
	success: (message) => logToFile(message, "success"),

	/**
	 * Log a running process message.
	 * @param {string} message - The message to log.
	 */
	running: (message) => logToFile(message, "running"),

	/**
	 * Log a warning message.
	 * @param {string} message - The message to log.
	 */
	warning: (message) => logToFile(message, "warning"),

	/**
	 * Log a debug message.
	 * @param {string} message - The message to log.
	 */
	debug: (message) => logToFile(message, "debug"),
};
