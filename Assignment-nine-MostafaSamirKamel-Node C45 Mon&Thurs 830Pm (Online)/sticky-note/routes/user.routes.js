const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.patch('/', auth, userController.updateUser);
router.delete('/', auth, userController.deleteUser);
router.get('/', auth, userController.getUser);

module.exports = router;
