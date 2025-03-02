const express = require('express');
const router = express.Router();

const { login, logout, refreshToken, status, register } = require('../controllers/auth.controller');
const { authenticate, unauthenticate, ensureAdmin, ensureStore, ensureCustomer } = require('../middlewares/auth.middleware');

const { loginValidation } = require('../validators/auth.validator');
const { createUserValidation } = require('../validators/user.validator');

/**
 * @description Authentication-related API endpoints.
 *
 * @route POST /api/v1/auth/login   - Log in a user
 * @route POST /api/v1/auth/refresh - Refresh an access token
 * @route POST /api/v1/auth/logout  - Log out a user
 */
router.get('/status', status);
router.post('/login', loginValidation, unauthenticate, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.post('/register', createUserValidation, register);

module.exports = router;
