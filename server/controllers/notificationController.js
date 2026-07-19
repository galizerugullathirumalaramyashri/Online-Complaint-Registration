const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).populate("complaint", "complaintId category status").sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) { next(error); }
};

exports.markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (error) { next(error); }
};

exports.markAllRead = async (req, res, next) => {
  try { await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true }); res.json({ message: "Notifications marked as read" }); }
  catch (error) { next(error); }
};
