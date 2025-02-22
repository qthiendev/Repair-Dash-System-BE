/**
 * Validate if the provided value is a number.
 * @param {any} value - The value to be validated
 * @returns {boolean} True if the value is a number, false otherwise
 */
exports.validateCountValue = async (value) => {
    return typeof value === 'number';
};
