const redis = require("redis");
const terminal = require("../utils/terminal");
require("dotenv").config();

const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;

const REDIS_URL = `redis://${password ?? ""}${host}:${port}`;

const client = redis.createClient({
	url: REDIS_URL,
	password: process.env.REDIS_PASSWORD || null,
	socket: {
		tls: process.env.REDIS_TLS === "true",
	},
});

client
	.connect()
	.then(() => {
		terminal.info(`redis.config.js | Redis connected to ${REDIS_URL}`);
	})
	.catch((err) => {
		terminal.error(
			`redis.config.js | Unable to connect to Redis at ${REDIS_URL}:`,
			err,
		);
	});

module.exports = client;
