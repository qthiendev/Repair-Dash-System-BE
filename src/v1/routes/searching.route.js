const express = require("express");
const router = express.Router();

const { searchService } = require("../controllers/searching.controller");

/**
 * @description Service search API endpoint.
 *
 * @route GET /api/v1/service/search - Search for services based on keyword and location priority
 */
router.get("/services", searchService);

module.exports = router;
