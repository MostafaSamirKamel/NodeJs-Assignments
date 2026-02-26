const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

router.post('/books', collectionController.createExplicitCollection);
router.post('/authors', collectionController.createImplicitCollection);
router.post('/logs/capped', collectionController.createCappedCollection);
router.post('/books/index', collectionController.createIndex);

module.exports = router;
