const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", default: null },
    type: { type: String, enum: ["complaint_created", "assigned", "status_changed", "message"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    delivered: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
