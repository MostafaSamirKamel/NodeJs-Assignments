const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

router.get('/', authorController.getAllAuthors);
router.post('/', authorController.insertOneAuthor);
router.delete('/:id', authorController.deleteAuthorById);

module.exports = router;
