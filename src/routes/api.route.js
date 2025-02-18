const express = require('express');
const app = express();
const countRoutes = require('./v1/countRoutes.v1');

/**
 * @description RESTful API for managing the count.
 * 
 * @route GET       /v1/count - Get the current count
 * @route POST      /v1/count - Increment the count by 1
 * @route PUT       /v1/count - Set the count to a specific value
 * @route DELETE    /v1/count - Reset the count to 0
 */
app.use('/v1/count', countRoutes);

module.exports = app;
