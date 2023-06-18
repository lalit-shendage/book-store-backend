const Book = require('../models/Book');

const fetchBooks = async (req, res) => {
  try {
    // Fetch all books from the database
    const books = await Book.find();

    // Return the books as a response
    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

module.exports = { fetchBooks };
