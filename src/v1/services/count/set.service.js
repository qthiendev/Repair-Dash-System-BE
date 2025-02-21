const { getCount, setCount } = require('../../utils/storage/count.storage');

/**
 * Set the count to a new value.
 * @param {number} newCount - The new value to set the count to
 * @returns {number} The new count value
 */
exports.set = async (newCount) => {
    setCount(newCount);
    return getCount;
};
