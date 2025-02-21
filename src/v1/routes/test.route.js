const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/test.controller');

/**
 * @description RESTful API for managing the count.
 * 
 * @route GET       - Get the current count
 * @route POST      - Increment the count by 1
 * @route PUT       - Set the count to a specific value
 * @route DELETE    - Reset the count to 0
 */
router.get('/user/:user_id?', getUserInfo);

module.exports = router;