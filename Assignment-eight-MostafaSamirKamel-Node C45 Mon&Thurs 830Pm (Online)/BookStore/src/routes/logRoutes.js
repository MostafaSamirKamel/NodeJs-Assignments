const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.get('/', logController.getAllLogs);
router.post('/', logController.insertLog);
router.delete('/:id', logController.deleteLogById);

module.exports = router;
