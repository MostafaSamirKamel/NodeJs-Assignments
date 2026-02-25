const express = require('express');
const router = express.Router();
const postController = require('./post.controller');

router.post('/', postController.createPost);
router.delete('/:postId', postController.deletePost);
router.get('/details', postController.getPostDetails);
router.get('/comment-count', postController.getPostsCommentCount);

module.exports = router;
