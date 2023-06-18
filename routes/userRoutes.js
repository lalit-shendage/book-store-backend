const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/validationMiddleware');

router.post('/login', userController.login);
router.post('/register', userController.register);

router.get('/userinfo',verifyToken, userController.getUserInfo);
router.put('/updateUser',verifyToken, userController.updateUser);

module.exports = router;

