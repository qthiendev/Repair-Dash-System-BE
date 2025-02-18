const { getCount } = require('../../../../utils/storage/count.storage');

/**
 * Get the current count.
 * @returns {number} The current count
 */
exports.current = async () => {
    return getCount();
};
