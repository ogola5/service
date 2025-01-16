const User = require('../models/User');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // User ID from decoded JWT
    const update = req.body;

    // Prevent updating email or password directly via this endpoint
    if (update.email || update.password) {
      return res.status(400).json({ message: 'Email and password cannot be updated here' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true }).select(
      '-password'
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // User ID from decoded JWT
    const user = await User.findById(userId).select('-password'); // Exclude password from response

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User profile retrieved successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
