import bcrypt from 'bcryptjs';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

/**
 * Creates a signed JWT for a user.
 *
 * @param {object} user - MongoDB user document.
 * @returns {string} Signed JWT token.
 */
function createToken(user) {
  return jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Handles user registration with hashed password storage.
 *
 * @param {import('express').Request} req - Request containing name, email, and password.
 * @param {import('express').Response} res - Response returning token and user name.
 * @returns {Promise<void>} Resolves after registration is handled.
 */
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Full name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'An account with this email already exists.' });
      return;
    }

    // Hash the password before saving the user record.
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = createToken(user);

    res.status(201).json({ token, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Unable to create account.', error: error.message });
  }
});

/**
 * Handles user login and returns a JWT when credentials are valid.
 *
 * @param {import('express').Request} req - Request containing email and password.
 * @param {import('express').Response} res - Response returning token and user name.
 * @returns {Promise<void>} Resolves after login is handled.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }

    const user = await User.findOne({ email });
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isMatch) {
      res.status(401).json({ message: 'Invalid email or password.' });
      return;
    }

    const token = createToken(user);
    res.json({ token, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Unable to log in.', error: error.message });
  }
});

export default router;

