const express = require('express');
const router = express.Router();
const commentController = require('./comment.controller');

router.post('/', commentController.createBulkComments);
router.patch('/:commentId', commentController.updateComment);
router.post('/find-or-create', commentController.findOrCreateComment);
router.get('/search', commentController.searchComments);
router.get('/newest/:postId', commentController.getNewestComments);
router.get('/details/:id', commentController.getCommentDetails);

module.exports = router;
