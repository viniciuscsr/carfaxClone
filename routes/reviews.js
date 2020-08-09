const express = require('express');
const router = express.Router({ mergeParams: true });
const car = require('../models/cars');
const Review = require('../models/reviews');
const middleware = require('../middleware');
const reviewController = require('../controllers/reviewController');

// REVIEWS FORM

router.get('/new', middleware.isLoggedIn, reviewController.getNewReviewForm);

// CREATING AND ASSOCIATING A NEW REVIEW

router.post('/', middleware.isLoggedIn, reviewController.postNewReview);

// EDIT ROUTE

router.get(
  '/:review_id/edit',
  middleware.checkReviewOwnership,
  reviewController.editReviewForm
);

// UPDATE ROUTE

router.put(
  '/:review_id/',
  middleware.checkReviewOwnership,
  reviewController.editReviewRoute
);

// DELETE ROUTE

router.delete(
  '/:review_id/',
  middleware.checkReviewOwnership,
  reviewController.deleteReview
);

module.exports = router;
