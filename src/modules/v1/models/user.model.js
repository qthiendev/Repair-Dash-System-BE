const { DataTypes } = require("sequelize");
const sequelize = require("../../../configs/database.config");

/** 
 * @description User Model 
 * @typedef {Object} User
 * @property {number} user_id - Unique identifier for the user.
 * @property {string} user_full_name - Full name of the user (max 500 chars, required).
 * @property {string} user_phone_number - Phone number of the user (max 20 chars, required).
 * @property {string} user_address - Address of the user (required).
 * @property {Date} created_at - Timestamp for when the record was created.
 * @property {Date} updated_at - Timestamp for when the record was last updated.
 * @property {boolean} delete_flag - Soft delete flag (true if deleted).
 * @property {number} authentication_id - Reference to the authentication record associated with the user.
 */
const User = sequelize.define("User", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_full_name: {
        type: DataTypes.STRING(500),
        allowNull: false,
    },
    user_phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    user_address: {
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
    authentication_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "authentications",
            key: "authentication_id",
        },
    },
}, {
    tableName: "users",
    timestamps: false,
});

module.exports = User;