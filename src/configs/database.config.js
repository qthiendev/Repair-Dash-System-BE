const { Sequelize } = require('sequelize');
const terminal = require('../utils/terminal');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        pool: {
            max: parseInt(process.env.DB_POOL_MAX, 10),
            min: parseInt(process.env.DB_POOL_MIN, 10),
            acquire: parseInt(process.env.DB_POOL_ACQUIRE, 10),
            idle: parseInt(process.env.DB_POOL_IDLE, 10),
        },
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
        },
        dialectOptions: {
            charset: 'utf8mb4',
        },
        logging: false,
    }
);

sequelize.authenticate()
    .then(() => {
        terminal.info('database.config.js | Database connection has been established successfully.');
    })
    .catch((err) => {
        terminal.error('database.config.js | Unable to connect to the database:', err);
    });

module.exports = sequelize;
