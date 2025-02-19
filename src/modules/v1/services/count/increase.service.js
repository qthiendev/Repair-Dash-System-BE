const { incrementCount } = require('../../../../utils/storage/count.storage');

/**
 * Increment the current count by 1.
 * @returns {number} The updated count
 */
exports.increase = async () => {
    return incrementCount();
};
