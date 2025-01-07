const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true, runValidators: true }
    );
    if (!updatedNotification) return res.status(404).json({ message: 'Notification not found' });
    res.json(updatedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};