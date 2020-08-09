const reviewController = {};
const car = require('../models/cars');
const Review = require('../models/reviews');

reviewController.getNewReviewForm = function (req, res) {
  car.findById(req.params.id, function (err, foundListing) {
    if (err) {
      console.log(err);
    } else {
      res.render('reviews/new', { cars: foundListing });
    }
  });
};

reviewController.postNewReview = function (req, res) {
  // look up listing using id
  car.findById(req.params.id, function (err, foundListing) {
    if (err) {
      console.log(err);
      res.redirect('/cars');
    } else {
      // create new review
      Review.create(req.body.reviews, function (err, review) {
        if (err) {
          req.flash('error', 'Ops.. Something went wrong');
          console.log(err);
        } else {
          // add email and id to review from login info
          review.author.id = req.user._id;
          review.author.email = req.user.email;
          // save review
          review.save();
          // connect new review to listing
          foundListing.reviews.push(review);
          foundListing.save();
          req.flash('success', 'Successfully created a new review');
          // redirect to listing show page
          res.redirect('/cars/' + foundListing._id);
        }
      });
    }
  });
};

reviewController.editReviewForm = function (req, res) {
  Review.findById(req.params.review_id, function (err, foundReview) {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.render('reviews/edit', {
        cars_id: req.params.id,
        review: foundReview,
      });
    }
  });
};

reviewController.editReviewRoute = function (req, res) {
  Review.findByIdAndUpdate(req.params.review_id, req.body.reviews, function (
    err,
    updatedReview
  ) {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      req.flash('success', 'Review Updated Sucessfully');
      res.redirect('/cars/' + req.params.id);
    }
  });
};

reviewController.deleteReview = function (req, res) {
  Review.findByIdAndDelete(req.params.review_id, function (err) {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      req.flash('success', 'Review Deleted');
      res.redirect('/cars/' + req.params.id);
    }
  });
};

module.exports = reviewController;
