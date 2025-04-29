const { runtimeInterval } = require('../../utils/runtimeInterval');
const terminal = require('../../utils/terminal');
const { Op } = require('sequelize');
const { Order, Payment, User } = require('../models/index.model');

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

/**
 * Checks for pending orders older than 15 minutes and cancels them
 */
const checkPendingOrders = async () => {
    try {
        const fifteenMinutesAgo = new Date(Date.now() - FIFTEEN_MINUTES);

        const pendingOrders = await Order.findAll({
            where: {
                order_status: 'PENDING',
                delete_flag: false
            }
        });

        const pendingOrdersOvertime = pendingOrders.filter(order => new Date(order.created_at) <= fifteenMinutesAgo);

        if (pendingOrders.length === 0) {
            terminal.info('checkPendingOrders | No pending orders to cancel');
            return;
        }

        if (pendingOrdersOvertime.length === 0) {
            terminal.info(`checkPendingOrders | Current pending orders: ${pendingOrders.length}, there is no order overtime`);
        } else {
            terminal.info(`checkPendingOrders | Current pending orders: ${pendingOrders.length}, ${pendingOrdersOvertime.length} order overtime`);
        }

        for (const order of pendingOrdersOvertime) {
            order.order_status = 'CANCELED';
            await order.save();
            terminal.info(`checkPendingOrders | Order ${order.order_id} canceled (created at ${order.created_at})`);
        }
    } catch (error) {
        terminal.error(`checkPendingOrders | Error: ${error.message}`);
    }
};

/**
 * Checks for expired subscriptions and resets user priority
 */
const checkSubscriptions = async () => {
    try {
        const now = new Date();

        const activePayments = await Payment.findAll({
            where: {
                payment_status: 'COMPLETED',
                delete_flag: false
            },
            include: [{
                model: User,
                as: 'user',
                where: { delete_flag: false },
                attributes: ['user_id', 'user_priority']
            }]
        });

        if (activePayments.length === 0) {
            terminal.info('checkSubscriptions | No active subscriptions to check');
            return;
        } else {
            terminal.info(`checkSubscriptions | Current active subcription: ${activePayments.length}`);
        }

        for (const payment of activePayments) {
            const createdDate = new Date(payment.created_at);
            let expirationDate;

            if (payment.payment_type === 'MONTHLY') {
                expirationDate = new Date(createdDate.setMonth(createdDate.getMonth() + 1));
            } else if (payment.payment_type === 'YEARLY') {
                expirationDate = new Date(createdDate.setFullYear(createdDate.getFullYear() + 1));
            }

            if (now > expirationDate && payment.User.user_priority !== 0) {
                payment.User.user_priority = 0;
                await payment.User.save();
                terminal.info(`checkSubscriptions | User ${payment.User.user_id} priority reset to 0 (subscription expired)`);
            }
        }
    } catch (error) {
        terminal.error(`checkSubscriptions | Error: ${error.message}`);
    }
};

/**
 * Single object to control interval operations
 */
const intervalController = {
    intervals: {
        order: null,
        subscription: null
    },

    /**
     * Starts all intervals
     * @returns {Object} Reference to the intervalController for chaining
     */
    start: function () {
        this.intervals.order = runtimeInterval(checkPendingOrders, FIVE_MINUTES, 'PendingOrderCheck');
        this.intervals.subscription = runtimeInterval(checkSubscriptions, ONE_HOUR, 'SubscriptionCheck');
        return this;
    },

    /**
     * Stops all intervals
     * @returns {Object} Reference to the intervalController for chaining
     */
    stop: function () {
        if (this.intervals.order) {
            this.intervals.order.stop();
            this.intervals.order = null;
        }
        if (this.intervals.subscription) {
            this.intervals.subscription.stop();
            this.intervals.subscription = null;
        }
        return this;
    }
};

module.exports = intervalController;
