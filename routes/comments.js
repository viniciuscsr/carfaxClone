const express = require('express');
const router = express.Router({ mergeParams: true });
const car = require('../models/cars');
const Comment = require('../models/comments');
const middleware = require('../middleware');

// COMMENTS FORM

router.get('/new', middleware.isLoggedIn, function (req, res) {
  car.findById(req.params.id, function (err, foundListing) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { cars: foundListing });
    }
  });
});

// CREATING AND ASSOCIATING A NEW COMMENT

router.post('', middleware.isLoggedIn, function (req, res) {
  // look up listing using id
  car.findById(req.params.id, function (err, foundListing) {
    if (err) {
      console.log(err);
      res.redirect('/cars');
    } else {
      // create new comment
      Comment.create(req.body.comments, function (err, comment) {
        if (err) {
          req.flash('error', 'Ops.. Something went wrong');
          console.log(err);
        } else {
          // add email and id to comment from login info
          comment.author.id = req.user._id;
          comment.author.email = req.user.email;
          // save comment
          comment.save();
          // connect new comment to listing
          foundListing.comments.push(comment);
          foundListing.save();
          req.flash('success', 'Successfully created a new comment');
          // redirect to listing show page
          res.redirect('/cars/' + foundListing._id);
        }
      });
    }
  });
});

// EDIT ROUTE

router.get('/:comment_id/edit', middleware.checkCommentOwnership, function (
  req,
  res
) {
  Comment.findById(req.params.comment_id, function (err, foundComment) {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      res.render('comments/edit', {
        cars_id: req.params.id,
        comment: foundComment,
      });
    }
  });
});

// UPDATE ROUTE

router.put('/:comment_id/', middleware.checkCommentOwnership, function (
  req,
  res
) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function (
    err,
    updatedComment
  ) {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      req.flash('success', 'Comment Updated Sucessfully');
      res.redirect('/cars/' + req.params.id);
    }
  });
});

// DELETE ROUTE

router.delete('/:comment_id/', middleware.checkCommentOwnership, function (
  req,
  res
) {
  Comment.findByIdAndDelete(req.params.comment_id, function (err) {
    if (err) {
      console.log(err);
      res.redirect('back');
    } else {
      req.flash('success', 'Comment Deleted');
      res.redirect('/cars/' + req.params.id);
    }
  });
});

// MIDDLEWARE

module.exports = router;
