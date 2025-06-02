const searchService = require("../services/searching/servicesSearching.service");
require("dotenv").config();

/**
 * Handles service searching based on location and keyword relevance.
 *
 * @route GET /api/v1/search/services
 * @query {string} keyword - The search keyword for service or store name.
 * @query {string} user_city - The user's city for location-based filtering.
 * @query {string} user_district - The user's district for refining results.
 * @query {string} user_ward - The user's ward for more precise filtering.
 * @query {string} [user_street] - (Optional) The user's street for finer location accuracy.
 * @query {number} [index] - (Optional) The pagination index for result offset.
 * @query {number} [max_range] - (Optional) Maximum search radius in kilometers.
 *
 * @returns {Object} 200 - { services: Array } if services are found.
 * @returns {Object} 400 - { message: 'Missing required parameters' } if necessary parameters are missing.
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal server errors.
 */
exports.searchService = async (req, res) => {
	try {
		const {
			keyword,
			user_city,
			user_district,
			user_ward,
			user_street,
			index,
			max_range,
			name_only,
		} = req.query;
		const services = await searchService(
			keyword,
			user_city,
			user_district,
			user_ward,
			user_street,
			index,
			max_range,
			name_only,
		);

		return res.status(200).json({ ...services });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};
