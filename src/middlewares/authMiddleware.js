const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token using the secret from the .env file
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user details to the request object for use in subsequent routes
    req.user = { id: user._id, role: user.role, email: user.email };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};
