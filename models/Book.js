const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  imageLink: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
