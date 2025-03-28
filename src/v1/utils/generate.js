/**
 * Generates a unique random string of a given length, ensuring it's not in the exclude list.
 * 
 * @param {number} length - The length of the random string.
 * @param {string[]} exclude - An array of existing aliases to avoid duplicates.
 * @param {string} chars - The set of characters to use for generation.
 * @returns {string|null} A unique random string or null if a unique string is not found within 100 attempts.
 */
exports.randomString = (length, exclude = [], chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') => {
    let attempts = 0;

    while (attempts < 100) {
        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            randomString += chars[randomIndex];
        }

        if (!exclude.includes(randomString)) {
            return randomString;
        }

        attempts++;
    }

    return null;
};
