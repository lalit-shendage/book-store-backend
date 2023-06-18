const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');
const { verifyToken } = require('../middleware/validationMiddleware');

router.get('/fetchBooks', booksController.fetchBooks);

module.exports = router;
