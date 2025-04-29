const terminal = require('./terminal');

/**
 * Runs a function in a loop with specified interval
 * @param {Function} callback - Function to execute
 * @param {number} interval - Interval in milliseconds
 * @param {string} loopName - Name of the loop for logging
 * @returns {Object} - Control object with stop method
 */
const runtimeInterval = (callback, interval, loopName) => {
    let isRunning = true;
    let intervalId = null;

    const run = async () => {
        try {
            await callback();
        } catch (error) {
            terminal.error(`${loopName} | Error in loop: ${error.message}`);
        }
    };

    run();

    intervalId = setInterval(run, interval);
    terminal.info(`${loopName} | Loop started with interval ${interval}ms`);

    return {
        stop: () => {
            if (intervalId) {
                clearInterval(intervalId);
                isRunning = false;
                terminal.info(`${loopName} | Loop stopped`);
            }
        },
        isRunning: () => isRunning
    };
};

module.exports = { runtimeInterval };
