const axios = require('axios').default;
const config = require('../../../configs/zalopay.config');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const { User, Payment } = require('../../models/index.model');

const terminal = require('../../../utils/terminal');

require('dotenv').config();

/**
 * Creates a ZaloPay payment order for a subscription (monthly or yearly) and saves the transaction as PENDING.
 * 
 * @param {number} user_id - The ID of the user making the subscription payment.
 * @param {string} type - The type of subscription: 'monthly' or 'yearly'.
 * @returns {Promise<Object|number>} Response from ZaloPay including `app_trans_id` on success,
 *                                   or error codes:
 *                                   -1 if subscription type is invalid,
 *                                   -2 if user is not found,
 *                                   -3 if payment record creation fails.
 */
module.exports = async (user_id, type) => {
    const MONTHLY_SUBSCRIPTION_FEE = 80000;
    const YEARLY_SUBSCRIPTION_FEE = 800000;
    var currentFee = 0;

    switch (type) {
        case 'MONTHLY':
            currentFee = MONTHLY_SUBSCRIPTION_FEE;
            break;
        case 'YEARLY':
            currentFee = YEARLY_SUBSCRIPTION_FEE;
            break;
        default:
            terminal.warning(`order.service.js | Invalid subscription type: ${type}.`);
            return -1;
    }

    const user = await User.findOne({
        where: {
            user_id,
            user_priority: 0,
        },
    });

    if (!user) {
        terminal.warning(`order.service.js | No authentication record found for user ${user_id}.`);
        return -2;
    }

    const embed_data = {
        redirecturl: process.env.ZALOPAY_REDIRECT_URL,
    };

    const items = [];
    const app_user = `${user_id}/${user.user_full_name}`;
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${user_id}_${transID}`,
        app_user: app_user,
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: currentFee,
        callback_url: config.callback,
        description: `ZaloPay - Payment order for type ${type} subscription by user '${user.user_full_name}'. #${transID}`,
        bank_code: '',
    };

    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order });

    if (response.data.return_code === 1) {
        const payment = await Payment.create({
            user_id: user_id,
            transaction_id: order.app_trans_id,
            payment_description: order.description,
            payment_status: 'PENDING',
            payment_type: type,
            user_full_name: user.user_full_name,
            payment_amount: order.amount,
        });

        if (!payment) {
            terminal.warning(`order.service.js | Failed to create payment record for user ${user_id}.`);
            return -3;
        }
    }

    return { ...response.data, app_trans_id: order.app_trans_id };
}