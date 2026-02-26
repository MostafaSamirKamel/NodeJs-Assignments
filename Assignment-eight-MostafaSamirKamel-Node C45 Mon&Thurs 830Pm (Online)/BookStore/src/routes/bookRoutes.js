const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.post('/', bookController.insertOneBook);
router.post('/batch', bookController.insertBatchBooks);
router.patch('/:title', bookController.updateBookByTitle);
router.get('/title', bookController.findBookByTitle);
router.get('/year', bookController.findBooksByYearRange);
router.get('/genre', bookController.findBooksByGenre);
router.get('/skip-limit', bookController.skipLimitSorted);
router.get('/year-integer', bookController.findBooksWithIntegerYear);
router.get('/exclude-genres', bookController.findBooksExcludingGenres);
router.delete('/before-year', bookController.deleteBooksBeforeYear);
router.get('/aggregate1', bookController.aggregate1);
router.get('/aggregate2', bookController.aggregate2);
router.get('/aggregate3', bookController.aggregate3);
router.get('/aggregate4', bookController.aggregate4);
router.delete('/:id', bookController.deleteBookById);

module.exports = router;
