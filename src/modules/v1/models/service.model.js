const { DataTypes } = require("sequelize");
const sequelize = require("../../../configs/database.config");

/** 
 * @description Service Model 
 * @typedef {Object} Service
 * @property {number} service_id - Unique identifier for the service.
 * @property {string} service_name - Name of the service (max 500 chars, required).
 * @property {string} service_description - Detailed description of the service (required).
 * @property {Date} created_at - Timestamp for when the record was created.
 * @property {Date} updated_at - Timestamp for when the record was last updated.
 * @property {boolean} delete_flag - Soft delete flag (true if deleted).
 * @property {number} owner_id - Reference to the user who owns this service.
 */
const Service = sequelize.define("Service", {
    service_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    service_name: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    service_description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
    delete_flag: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "user_id",
        },
    },
}, {
    tableName: "services",
    timestamps: false,
});

module.exports = Service;