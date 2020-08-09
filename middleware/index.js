const middlewareObj = {};
const Review = require('../models/reviews');
const car = require('../models/cars');

middlewareObj.checkListingOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    car.findById(req.params.id, function (err, foundListing) {
      if (err) {
        req.flash('error', 'Listing not found');
        console.log(err);
        res.redirect('back');
      } else {
        // does user own the listing
        if (foundListing.author.id.equals(req.user.id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in');
    res.redirect('back');
  }
};

middlewareObj.checkReviewOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Review.findById(req.params.review_id, function (err, foundReview) {
      if (err) {
        console.log(err);
        res.redirect('back');
      } else {
        // does user own the listing
        if (foundReview.author.id.equals(req.user.id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'Please Login First');
    res.redirect('back');
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in');
  res.redirect('/login');
};

module.exports = middlewareObj;
