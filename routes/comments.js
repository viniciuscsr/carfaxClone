const express = require('express');
const router = express.Router({ mergeParams: true });
const car = require('../models/cars');
const Comment = require('../models/comments');
const middleware = require('../middleware');
const commentController = require('../controllers/commentController');

// COMMENTS FORM

router.get('/new', middleware.isLoggedIn, commentController.getNewCommentForm);

// CREATING AND ASSOCIATING A NEW COMMENT

router.post('/', middleware.isLoggedIn, commentController.postNewComment);

// EDIT ROUTE

router.get(
  '/:comment_id/edit',
  middleware.checkCommentOwnership,
  commentController.editCommentForm
);

// UPDATE ROUTE

router.put(
  '/:comment_id/',
  middleware.checkCommentOwnership,
  commentController.editCommentRoute
);

// DELETE ROUTE

router.delete(
  '/:comment_id/',
  middleware.checkCommentOwnership,
  commentController.deleteComment
);

module.exports = router;
