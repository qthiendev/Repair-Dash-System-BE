const { DataTypes } = require('sequelize');
const sequelize = require('../../configs/database.config');
const User = require('./user.model');

/** 
 * @description Employee Model 
 * @typedef {Object} Employee
 * @property {number} employee_id - Unique identifier for the employee.
 * @property {string} employee_full_name - Full name of the employee (max 500 chars).
 * @property {Date} created_at - Timestamp for when the record was created.
 * @property {Date} updated_at - Timestamp for when the record was last updated.
 * @property {boolean} delete_flag - Soft delete flag (true if deleted).
 * @property {number} owner_id - Reference to the user who owns this employee record.
 */
const Employee = sequelize.define('Employee', {
    employee_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, },
    employee_full_name: { type: DataTypes.STRING(500), allowNull: false, },
    employee_avatar_url: { type: DataTypes.STRING(500), allowNull: true, },
    delete_flag: { type: DataTypes.BOOLEAN, defaultValue: false, },
    owner_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'user_id', }, },
}, {
    tableName: 'employees',
    timestamps: true,
    underscored: true,
});

module.exports = Employee;
