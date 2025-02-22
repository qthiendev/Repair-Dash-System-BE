const express = require('express');
const router = express.Router();
const { current, increase, set, reset } = require('../controllers/count.controller');

/**
 * @description RESTful API for managing the count.
 * 
 * @route GET       - Get the current count
 * @route POST      - Increment the count by 1
 * @route PUT       - Set the count to a specific value
 * @route DELETE    - Reset the count to 0
 */
router.get('/', current);
router.post('/', increase);
router.put('/', set);
router.delete('/', reset);

module.exports = router;
