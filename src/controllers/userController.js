const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming user is authenticated
    const update = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password'); // Exclude password from response
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};