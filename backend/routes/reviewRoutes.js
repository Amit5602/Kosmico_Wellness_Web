const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// The route will be mounted to /api/v1/products/:productId/reviews
router.route('/')
  .get(reviewController.getReviews)
  .post(protect, reviewController.createReview);

// Global route if productId is omitted, mounted at /api/v1/reviews
// wait, the router is mounted in app.js. Let's see how it's mounted.
// I will just add the controller logic.

router.get('/stats', reviewController.getRatingStats);

// These routes don't strictly need productId, but are under the same mount
router.route('/:id')
  .patch(protect, reviewController.updateReview)
  .delete(protect, reviewController.deleteReview);

router.post('/:id/helpful', protect, reviewController.toggleHelpful);

module.exports = router;
