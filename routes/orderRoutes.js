const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/validationMiddleware');

router.post('/checkout',verifyToken, orderController.checkout);

router.get('/userOrder/:id',verifyToken, orderController.fetchOrders);

router.delete('/removeOrder/:orderId', verifyToken, orderController.removeOrder);

module.exports = router;
