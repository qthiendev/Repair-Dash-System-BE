const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/database.config");
const User = require("./user.model");
const Service = require("./service.model");

/**
 * @description Favorite Model
 * @typedef {Object} Favorite
 * @property {number} favorite_id - Unique identifier for the favorite.
 * @property {number} customer_id - Reference to the user who is the customer.
 * @property {number} store_id - Reference to the user who owns the store.
 * @property {number} service_id - Reference to the service.
 * @property {Date} created_at - Timestamp for when the record was created.
 * @property {Date} updated_at - Timestamp for when the record was last updated.
 */
const Favorite = sequelize.define(
	"Favorite",
	{
		favorite_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		customer_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: User, key: "user_id" },
		},
		store_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: User, key: "user_id" },
		},
		service_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: Service, key: "service_id" },
		},
	},
	{
		tableName: "favorites",
		timestamps: true,
		underscored: true,
	},
);

module.exports = Favorite;
