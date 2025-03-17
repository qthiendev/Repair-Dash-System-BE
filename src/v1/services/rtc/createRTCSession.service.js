const { or } = require('sequelize');
const redis = require('../../../configs/redis.config');
const { Order } = require('../../models/index.model');
const { v4: uuidv4 } = require('uuid');
const terminal = require('../../../utils/terminal');

module.exports = async (order_id) => {
    const session_id = uuidv4();

    const sessionKey = `rtc:session:${order_id}:${session_id}`;

    const sessionData = {
        session_id,
        order_id,
        created_date: Date.now(),
    };

    await redis.hSet(sessionKey, sessionData);
    await redis.expire(sessionKey, 86400);

    const order = await Order.update({ order_rtc_session_id: session_id }, { where: { order_id } });

    if (order[0] === 0) {
        terminal.warning(`createRTCSession.service.js | RTC session ${session_id} not created for order ${order_id}.`);
        return -1;
    }

    terminal.success(`createRTCSession.service.js | RTC session ${session_id} created for order ${order_id}.`);
    return sessionData;
};
