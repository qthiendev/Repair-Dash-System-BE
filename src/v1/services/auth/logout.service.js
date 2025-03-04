const client = require("../../../configs/redis.config");
const jwt = require("jsonwebtoken");

/**
 * Logout user by deleting refresh token from Redis and blacklisting access token.
 * @param {string} accessToken - The access token.
 * @returns {number} - Returns 0 on success, -1 if unauthorized.
 */
module.exports = async (accessToken) => {
    if (!accessToken) {
        terminal.error('logout.service.js | Missing Access Token');
        return -1;
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const userId = decoded.user_id;

    await client.del(userId.toString());
    const remainingTime = decoded.exp - Math.floor(Date.now() / 1000);
    if (remainingTime > 0) {
        await client.setEx(`blacklist:${accessToken}`, remainingTime, "1");
    }

    return 0;
};
