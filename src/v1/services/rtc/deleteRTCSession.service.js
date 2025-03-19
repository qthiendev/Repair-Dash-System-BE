const redis = require('../../../configs/redis.config');

module.exports = async (order_id, session_id) => {
    const sessionKey = `rtc:session:${order_id}:${session_id}`;
    return await redis.del(sessionKey);
};
