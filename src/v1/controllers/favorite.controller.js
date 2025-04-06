const getFavoritesService = require('../services/favorite/getFavorite.service');
const createFavoriteService = require('../services/favorite/createFavorite.service');
const deleteFavoriteService = require('../services/favorite/deleteFavorite.service');
const jwt = require('jsonwebtoken');
const terminal = require('../../utils/terminal');

exports.getFavorites = async (req, res) => {
    try {
        const user_id = jwt.verify(req.cookies?.accessToken, process.env.JWT_SECRET_KEY).user_id;
        const { index = 1, max_range = 10, store_only = null } = req.query;

        const favorites = await getFavoritesService(user_id, parseInt(index), parseInt(max_range), store_only === 'true' ? true : store_only === 'false' ? false : null);

        return res.status(200).json({ ...favorites });
    } catch (error) {
        terminal.error(`favorite.controller.js | Error retrieving favorites: ${error.message}`);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

exports.createFavorite = async (req, res) => {
    try {
        const user_id = jwt.verify(req.cookies?.accessToken, process.env.JWT_SECRET_KEY).user_id;
        const { store_id = null, service_id = null } = req.body;

        const result = await createFavoriteService(user_id, store_id, service_id);

        switch (result) {
            case -1:
                return res.status(404).json({ message: 'Customer not found', code: -1 });
            case -2:
                return res.status(400).json({ message: 'Must provide either store_id or service_id, but not both', code: -2 });
            case -3:
                return res.status(404).json({ message: 'Store not found or deleted', code: -3 });
            case -4:
                return res.status(404).json({ message: 'Service not found or deleted', code: -4 });
            case -5:
                return res.status(400).json({ message: 'User is not a store', code: -5 });
            case -6:
                return res.status(400).json({ message: 'Favorite already exists', code: -6 });
            default:
                return res.status(201).json({ favorite_id: result });
        }
    } catch (error) {
        terminal.error(`favorite.controller.js | Error adding favorite: ${error.message}`);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

exports.deleteFavorite = async (req, res) => {
    try {
        const { favorite_id } = req.params;

        const result = await deleteFavoriteService(favorite_id);

        if (result === 0) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        return res.status(200).json({ message: 'Favorite deleted successfully' });
    } catch (error) {
        terminal.error(`favorite.controller.js | Error deleting favorite: ${error.message}`);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};
