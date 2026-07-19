const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { notify } = require("../services/notificationService");

const channels = ["inApp", "email"];

exports.createComplaint = async (req, res, next) => {
  try {
    const duplicateComplaint = await Complaint.findOne({
      user: req.user._id,
      category: req.body.category,
      department: req.body.department,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      status: {
        $nin: ["Resolved", "Closed", "Rejected"]
      }
    });

    if (duplicateComplaint) {
      return res.status(409).json({
        message: `A similar complaint already exists. Complaint ID: ${duplicateComplaint.complaintId}`
      });
    }

    const complaint = await Complaint.create({
      ...req.body,
      user: req.user._id,
      name: req.user.name
    });

    const admins = await User.find({ role: "admin" });

    await Promise.all(
      admins.map((admin) =>
        notify({
          recipient: admin,
          complaint: complaint._id,
          type: "complaint_created",
          title: "New complaint received",
          message: `${complaint.complaintId}: ${complaint.category} was submitted.`,
          channels
        })
      )
    );

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === "user") {
      filter.user = req.user._id;
    }

    if (req.user.role === "agent") {
      filter.assignedAgent = req.user._id;
    }

    const complaints = await Complaint.find(filter)
      .populate("user", "name email phone")
      .populate("assignedAgent", "name email department")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    next(error);
  }
};

exports.getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("assignedAgent", "name email department")
      .populate("actionLogs.updatedBy", "name role");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const isOwner =
      complaint.user._id.toString() === req.user._id.toString();

    const isAssignedAgent =
      complaint.assignedAgent &&
      complaint.assignedAgent._id.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isOwner && !isAssignedAgent) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

exports.assignComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        assignedAgent: req.body.agentId,
        status: "Assigned"
      },
      { new: true }
    )
      .populate("user", "name email phone")
      .populate("assignedAgent", "name email phone department");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await notify({
      recipient: complaint.user,
      complaint: complaint._id,
      type: "assigned",
      title: "Your complaint was assigned",
      message: `${complaint.complaintId} has been assigned to ${
        complaint.assignedAgent?.name || "an officer"
      }.`,
      channels
    });

    if (complaint.assignedAgent) {
      await notify({
        recipient: complaint.assignedAgent,
        complaint: complaint._id,
        type: "assigned",
        title: "A complaint was assigned to you",
        message: `${complaint.complaintId}: ${complaint.category}.`,
        channels
      });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "In Progress",
      "Resolved",
      "Closed",
      "Rejected"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status selected"
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const isAssignedAgent =
      complaint.assignedAgent &&
      complaint.assignedAgent.toString() === req.user._id.toString();

    if (!isAssignedAgent) {
      return res.status(403).json({
        message: "Only the assigned agent can update this complaint status"
      });
    }

    complaint.status = status;

    complaint.actionLogs.push({
      status,
      updatedBy: req.user._id
    });

    await complaint.save();

    const updatedComplaint = await Complaint.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("assignedAgent", "name email department")
      .populate("actionLogs.updatedBy", "name role");

    await notify({
      recipient: updatedComplaint.user,
      complaint: updatedComplaint._id,
      type: "status_changed",
      title: "Complaint status updated",
      message: `${updatedComplaint.complaintId} is now ${updatedComplaint.status}.`,
      channels
    });

    res.json(updatedComplaint);
  } catch (error) {
    next(error);
  }
};

exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    await complaint.deleteOne();

    res.json({ message: "Complaint deleted" });
  } catch (error) {
    next(error);
  }
};