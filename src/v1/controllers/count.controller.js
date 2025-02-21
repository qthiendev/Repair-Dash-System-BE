const { current } = require('../services/count/current.service');
const { increase } = require('../services/count/increase.service');
const { set } = require('../services/count/set.service');
const { reset } = require('../services/count/reset.service');

const { validateCountValue } = require('../validators/count.validator');

/**
 * Get the current count.
 * @route GET /api/v1/count
 * @returns {Object} 200 - { count: number }
 * @returns {Object} 500 - Unexpected error occurred
 */
exports.current = async (req, res) => {
    try {
        console.log('Current count requested');
        const count = await current();
        return res.status(200).json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Increment the count by 1.
 * @route POST /api/v1/count
 * @returns {Object} 200 - { message: 'Count incremented', count: number }
 * @returns {Object} 500 - Unexpected error occurred
 */
exports.increase = async (req, res) => {
    try {
        console.log('Increase count requested');
        const count = await increase();
        return res.status(200).json({ message: 'Count incremented', count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Set the count to a specific value.
 * @route PUT /api/v1/count
 * @param {number} req.body.value - The value to set the count to
 * @returns {Object} 200 - { message: 'Count set', count: number }
 * @returns {Object} 400 - Invalid input (Value must be a number)
 * @returns {Object} 500 - Unexpected error occurred
 */
exports.set = async (req, res) => {
    const { value } = req.body;

    try {
        console.log('Set count requested');
        if (!await validateCountValue(value)) {
            return res.status(400).json({ message: 'Value must be a number' });
        }

        await set(value);
        return res.status(200).json({ message: `Count set`, count: await current() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Reset the count to 0.
 * @route DELETE /api/v1/count
 * @returns {Object} 200 - { message: 'Count reset to 0', count: number }
 * @returns {Object} 500 - Unexpected error occurred
 */
exports.reset = async (req, res) => {
    try {
        console.log('Reset count requested');
        const count = await reset();
        return res.status(200).json({ message: 'Count reset to 0', count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};
