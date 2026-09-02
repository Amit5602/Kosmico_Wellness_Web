const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, paymentController.createPayment);
router.post('/verify', protect, paymentController.verifyPayment);

// Webhook requires raw body parsing, which must be handled at app.js level
// However, the route itself is defined here
router.post('/webhook', paymentController.handleWebhook);

module.exports = router;
