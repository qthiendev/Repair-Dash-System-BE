const express = require('express');
const router = express.Router();

const { login, logout, refreshToken, status, register, sendLink, resetPass } = require('../controllers/auth.controller');
const { authenticate, unauthenticate, ensureAdmin, ensureStore, ensureCustomer } = require('../middlewares/auth.middleware');

const { loginValidation } = require('../validators/auth.validator');
const { createUserValidation, restPasswordValidation } = require('../validators/user.validator');

/**
 * @description Authentication-related API endpoints.
 *
 * @route POST /api/v1/auth/login   - Log in a user
 * @route POST /api/v1/auth/refresh - Refresh an access token
 * @route POST /api/v1/auth/logout  - Log out a user
 * @route POST /api/v1/auth/send_link  - Send link for user
 * @route POST /api/v1/auth/reset_pass  - Reset password a user
 */
router.get('/status', status);
router.post('/login', loginValidation, unauthenticate, login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticate, logout);
router.post('/register', createUserValidation, register);
router.post('/send_link', sendLink);
router.post('/reset_pass',restPasswordValidation, resetPass);

module.exports = router;
