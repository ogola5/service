const PendingUser = require('../models/PendingUser');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
//const generateToken = require('../utils/generateToken');

// Signup Schema Validation
const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('job_seeker', 'employer').required(), // Matches roles in User model
});

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET, // Ensure you set this in your environment variables
    { expiresIn: '1h' }
  );
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if the user already exists in the User or PendingUser collections
    const existingUser = await User.findOne({ email });
    const existingPendingUser = await PendingUser.findOne({ email });
    if (existingUser || existingPendingUser) {
      return res.status(400).json({ message: 'Email already in use or awaiting verification' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Hashed password during signup: ${hashedPassword}`);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Save the pending user
    const pendingUser = new PendingUser({
      username,
      email,
      password: hashedPassword,
      role,
      verificationToken,
    });
    await pendingUser.save();

    // Send the verification email
    const verificationLink = `${req.protocol}://${req.get('host')}/api/auth/verify-email?token=${verificationToken}`;
    await sendEmail(email, 'Verify Your Email', `Click here to verify your email: ${verificationLink}`);

    res.status(201).json({ message: 'Signup successful! Check your email to verify your account.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
//email verifcation
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Find the pending user by token
    const pendingUser = await PendingUser.findOne({ verificationToken: token });
    if (!pendingUser) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Move the pending user to the main User collection
    const { username, email, password, role } = pendingUser;
    const user = new User({ username, email, password, role, verified: true });
    await user.save();

    // Remove the pending user
    await PendingUser.deleteOne({ _id: pendingUser._id });

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};
// Login


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate the input fields
    if (!email || !password) {
      console.log('Email or password missing in request body.');
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Log the stored hashed password
    console.log(`Stored hashed password: ${user.password}`);
    console.log(`Provided password: ${password}`);

    // Check if the user has verified their email
    if (!user.verified) {
      console.log(`User ${email} has not verified their email.`);
      return res.status(400).json({ message: 'Please verify your email before logging in.' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password mismatch for user ${email}`);
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Generate a token for the user
    const token = generateToken(user);

    // Send a success response with the token and user details
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};
