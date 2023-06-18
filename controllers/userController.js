const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    // Retrieve the registration data from the request body
    const { email, name, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      address: null,
    });

    // Save the User to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    // Retrieve the login data from the request body
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create and sign a JWT token
    const token = jwt.sign({ userId: user._id }, 'Ghost');

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    // Retrieve the user from the request object
    const user = await User.findById(req.user.userId);

    // If the user is not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user information
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user information' });
  }
}

const updateUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {name,email, address } = req.body;

    const user = await User.findById(userId);
    console.log(user.address)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (address) {
      user.address = address;
    }
await user.save()

    res.json({
      user: {
        name:user.name,
        email:user.email,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user information' });
  }
};

module.exports = { updateUser };


module.exports = { register, login, getUserInfo, updateUser};
