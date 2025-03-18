const { DataTypes } = require('sequelize');
const sequelize = require('../../configs/database.config');
const User = require('./user.model');

/** 
 * @description System Report Model 
 * @typedef {Object} SystemReport
 * @property {number} report_id - Unique identifier for the report.
 * @property {string} report_description - Detailed description of the report (required).
 * @property {Date} created_at - Timestamp for when the record was created.
 * @property {Date} updated_at - Timestamp for when the record was last updated.
 * @property {boolean} delete_flag - Soft delete flag (true if deleted).
 * @property {number} user_id - Reference to the user who submitted the report.
 */
const SystemReport = sequelize.define('SystemReport', {
    report_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    report_description: { type: DataTypes.TEXT, allowNull: false, },
    report_image_url: { type: DataTypes.TEXT, allowNull: true, },
    delete_flag: { type: DataTypes.BOOLEAN, defaultValue: false, },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'user_id', }, },
}, {
    tableName: 'system_reports',
    timestamps: true,
    underscored: true,
});

module.exports = SystemReport;
