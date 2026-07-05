const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    category: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    attachmentUrl: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Assigned", "In Progress", "Resolved", "Rejected", "Reopened"], default: "Pending" },
    actionLogs: [
      {
        note: String,
        status: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

complaintSchema.pre("save", function (next) {
  if (!this.complaintId) this.complaintId = `CMP-${Date.now().toString().slice(-8)}`;
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema);