const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');
const mongoose = require('mongoose');


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



const removeOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Check if the order with the given ID exists
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if the user making the request is the owner of the order
    if (order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to remove this order' });
    }

    // Implement logic to remove the order
    await Order.findByIdAndRemove(orderId);

    // Send a success response
    res.status(200).json({ success: true, message: 'Order removed successfully' });
  } catch (error) {
    // Handle errors and send an error response
    console.error('Error removing order:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { checkout, fetchOrders,removeOrder };
