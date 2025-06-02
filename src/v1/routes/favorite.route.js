const express = require("express");
const router = express.Router();

const {
	getFavorites,
	createFavorite,
	deleteFavorite,
} = require("../controllers/favorite.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const {
	addFavoriteValidation,
	deleteFavoriteValidation,
} = require("../validators/favorite.validator");

/**
 * @description Favorite-related API endpoints.
 *
 * @route GET  /api/v1/favorites           - Get paginated favorites
 * @route POST /api/v1/favorites           - Add a new favorite
 * @route DELETE /api/v1/favorites/:id     - Remove a favorite
 */
router.get("/", authenticate, getFavorites);
router.post("/", authenticate, addFavoriteValidation, createFavorite);
router.delete(
	"/:favorite_id",
	authenticate,
	deleteFavoriteValidation,
	deleteFavorite,
);

module.exports = router;
