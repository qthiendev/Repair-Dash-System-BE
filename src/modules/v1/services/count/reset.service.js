const { resetCount } = require('../../../../utils/storage/count.storage');

/**
 * Reset the count to 0.
 * @returns {number} The reset count (0)
 */
exports.reset = async () => {
    return resetCount();
};
