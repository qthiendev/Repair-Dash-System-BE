const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

require("dotenv").config();

module.exports = async () => {
	try {
		const connection = await mysql.createConnection({
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			multipleStatements: true,
		});

		const migrationFile = path.resolve(
			__dirname,
			"../../database/migrations/latest-rddb.migration.sql",
		);
		const seederFile = path.resolve(
			__dirname,
			"../../database/seeders/latest-rddb.seeder.sql",
		);

		if (fs.existsSync(migrationFile)) {
			const migrationSQL = fs.readFileSync(migrationFile, "utf8");
			console.log(`Running migration: latest-rddb.migration`);
			await connection.query(migrationSQL);
		} else {
			console.warn("Migration file not found!");
		}

		if (fs.existsSync(seederFile)) {
			const seederSQL = fs.readFileSync(seederFile, "utf8");
			console.log(`Running seeder: latest-rddb.seeder`);
			await connection.query(seederSQL);
		} else {
			console.warn("Seeder file not found!");
		}

		console.log("Migration and seeding completed successfully.");
		await connection.end();
	} catch (error) {
		console.error("Migration error:", error);
	}
};
