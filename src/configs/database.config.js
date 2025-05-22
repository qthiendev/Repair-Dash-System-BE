const { Sequelize } = require("sequelize");
const terminal = require("../utils/terminal");
const migrate = require("../utils/migrateOnLoad");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize({
	dialect: process.env.DB_DIALECT || "mysql",
	host: process.env.DB_HOST || "localhost",
	port: process.env.DB_PORT || 3306,
	username: process.env.DB_USER || "root",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME || "",
	logging: isProduction ? false : console.log,
	define: {
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_ci",
	},
	dialectOptions: {
		charset: "utf8mb4",
	},
	pool: {
		max: parseInt(process.env.DB_POOL_MAX, 10) || 5,
		min: parseInt(process.env.DB_POOL_MIN, 10) || 0,
		acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10) || 30000,
		idle: parseInt(process.env.DB_POOL_IDLE, 10) || 10000,
	},
});

sequelize
	.authenticate()
	.then(async () => {
		terminal.info(
			`database.config.js | Database connected: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
		);
		if (process.env.MIGRATE_ON_LOAD === "true") {
			await migrate();
		}
	})
	.catch((err) => {
		terminal.error(
			`database.config.js | Database connection failed at ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
			err,
		);
	});

module.exports = sequelize;
