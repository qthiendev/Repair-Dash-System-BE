let count = 0;

/**
 * Get the current in-memory count.
 * @returns {number} The current in-memory count
 */
exports.getCount = () => count;

/**
 * Set the in-memory count to a new value.
 * @param {number} newCount - The new count value to set
 */
exports.setCount = (newCount) => {
	count = newCount;
};

/**
 * Increment the in-memory count by 1.
 * @returns {number} The incremented count
 */
exports.incrementCount = () => {
	count++;
	return count;
};

/**
 * Reset the in-memory count to 0.
 * @returns {number} The reset count (0)
 */
exports.resetCount = () => {
	count = 0;
	return count;
};
