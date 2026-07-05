const Message = require("../models/Message");
const Complaint = require("../models/Complaint");

exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ complaint: req.params.complaintId }).populate("sender", "name role").sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) { next(error); }
};

exports.createMessage = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.complaintId);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    const message = await Message.create({ complaint: complaint._id, sender: req.user._id, text: req.body.text });
    await message.populate("sender", "name role");
    res.status(201).json(message);
  } catch (error) { next(error); }
};