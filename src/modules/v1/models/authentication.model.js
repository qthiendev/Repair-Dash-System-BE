const { DataTypes } = require("sequelize");
const sequelize = require("../../../configs/database.config");

/** 
 * @description Authentication Model 
 * @typedef {Object} Authentication
 * @property {number} authentication_id - Unique identifier for authentication records.
 * @property {string} identifier_emaill - Email identifier for authentication (max 1000 chars).
 * @property {string} password - Hashed password for authentication.
 * @property {"ADMIN" | "STORE" | "CUSTOMER"} role - Role of the authenticated user.
 * @property {Date} created_at - Timestamp for when the record was created.
 * @property {Date} updated_at - Timestamp for when the record was last updated.
 * @property {boolean} delete_flag - Soft delete flag (true if deleted).
 */
const Authentication = sequelize.define("Authentication", {
    authentication_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    identifier_email: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(1000),
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM("ADMIN", "STORE", "CUSTOMER"),
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
}, {
    tableName: "authentications",
    timestamps: false,
});

module.exports = Authentication;