const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');

const checkout = async (req, res) => {
  try {
    const { userId, bookIds, quantities } = req.body;

    // Find the user by the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create an array of book objects with IDs and quantities
    const books = bookIds.map((bookId, index) => ({
      book: bookId,
      quantity: quantities[index],
    }));

    // Calculate the total amount
    let totalAmount = 0;
    for (let i = 0; i < books.length; i++) {
      const book = await Book.findById(books[i].book);
      if (!book) {
        return res.status(400).json({ message: 'Invalid book ID(s)' });
      }
      totalAmount += book.price * books[i].quantity;
    }

    // Create a new order
    const newOrder = new Order({
      user: userId,
      books: books,
      totalAmount: totalAmount,
    });

    // Save the order to the database
    await newOrder.save();

    // Update the user's orders array
    user.orders.push(newOrder._id);
    await user.save();

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place the order' });
  }
};

const mongoose = require('mongoose');

const fetchOrders = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const orders = await Order.find({ user: id }).populate('books');

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};


module.exports = { checkout, fetchOrders };
