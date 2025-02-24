const { DataTypes } = require('sequelize');
const sequelize = require('../../configs/database.config');
const User = require('./user.model');
const Service = require('./service.model');
const Employee = require('./employee.model');

/** 
 * @description Order Model 
 * @typedef {Object} Order
 * @property {number} order_id - Unique identifier for the order.
 * @property {string} order_description - Description of the order.
 * @property {string} store_address - Address of the store (required).
 * @property {string} customer_address - Address of the customer (required).
 * @property {'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'} order_status - Current status of the order.
 * @property {string} order_feedback - Feedback from the customer.
 * @property {Date} created_at - Timestamp for when the record was created.
 * @property {Date} updated_at - Timestamp for when the record was last updated.
 * @property {boolean} delete_flag - Soft delete flag (true if deleted).
 * @property {number} customer_id - Reference to the customer who placed the order.
 * @property {number} service_id - Reference to the service associated with the order.
 * @property {number} employee_id - Reference to the employee handling the order.
 */
const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_description: {
        type: DataTypes.TEXT,
    },
    store_address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    customer_address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    order_status: {
        type: DataTypes.ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'),
        allowNull: false,
    },
    order_feedback: {
        type: DataTypes.TEXT,
    },
    delete_flag: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
    },
    service_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Service,
            key: 'service_id',
        },
    },
    employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Employee,
            key: 'employee_id',
        },
    },
}, {
    tableName: 'orders',
    timestamps: true,
    underscored: true,
});

module.exports = Order;
