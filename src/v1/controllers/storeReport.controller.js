const { Order, User, Authentication, Service, Employee } = require('../models/index.model');
const { Op, Sequelize } = require('sequelize');
const terminal = require('../../utils/terminal');
const readServiceReportService = require('../services/storeReports/serviceReports.service');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// ... (Keep your existing code like parseOrderDescription, getSingleOrder, etc.)

/**
 * Retrieve service report for the store user with pagination.
 * @route GET /api/v1/services/report/:service_id?
 * @param {number} [service_id] - (Optional) The ID of the service.
 * @query {number} [index] - Page number (default 1).
 * @query {number} [max_range] - Items per page (default 20).
 * @returns {Object} 200 - { total_pages, current_page, services, total } Report data
 * @returns {Object} 404 - { message: 'Service not found or not owned' } if specific service_id is invalid
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.readServiceReport = async (req, res) => {
    try {
        const { service_id } = req.params;
        const { index, max_range } = req.query;
        
        const user_id = jwt.verify(req.cookies?.accessToken, process.env.JWT_SECRET_KEY).user_id;

        const result = await readServiceReportService(
            user_id,
            service_id ?? null,
            Number(index) ?? 1,
            Number(max_range) ?? 10
        );

        if (result === -1) {
            return res.status(404).json({ message: 'Service not found or not owned', code: -1 });
        }

        res.status(200).json(result);
    } catch (error) {
        terminal.error(`order.controller.js | Read Service Report Error: ${error.message}`);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};
