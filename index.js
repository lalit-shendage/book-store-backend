// index.js
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const booksRoutes = require('./routes/booksRoutes');
const orderRoutes = require('./routes/orderRoutes');
const database = require('./config/database');
const app = express();

database();

app.use(cors());
// Parse incoming request bodies
app.use(bodyParser.json());

// Routes
app.use('/', userRoutes);
app.use('/books', booksRoutes);
app.use('/order', orderRoutes);



// Start the server
app.listen(5000, () => {
  console.log('Server started on port 5000');
});

