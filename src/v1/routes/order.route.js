const express = require('express');
const router = express.Router();

const { 
    readCheckout, 
    createOrder, 
    readOrder,
    updateOrder,
    deleteOrder
} = require('../controllers/order.controller');

const { 
    createOrderValidation, 
    readCheckoutValidation, 
    updateOrderValidation,
    deleteOrderValidation
} = require('../validators/order.validator');

const { authenticate, ensureAdmin } = require('../middlewares/auth.middleware');

/**
 * @description Authentication-related API endpoints.
 *
 * @route POST /api/v1/auth/login   - Log in a user
 * @route POST /api/v1/auth/refresh - Refresh an access token
 * @route POST /api/v1/auth/logout  - Log out a user
 * @route POST /api/v1/auth/send_link  - Send link for user
 * @route POST /api/v1/auth/reset_pass  - Reset password a user
 */
router.get('/:order_id?', authenticate, readOrder);
router.post('', authenticate, createOrderValidation, createOrder);
router.put('/:order_id', authenticate, updateOrderValidation, updateOrder);
router.delete('/:order_id', authenticate, ensureAdmin, deleteOrderValidation, deleteOrder);

router.get('/services/:service_id', authenticate, readCheckoutValidation, readCheckout);

module.exports = router;
