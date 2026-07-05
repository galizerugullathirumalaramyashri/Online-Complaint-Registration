const Complaint = require("../models/Complaint");

exports.createComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.create({
      ...req.body,
      user: req.user._id,
      name: req.user.name
    });

    res.status(201).json(complaint);
  } catch (error) {
    next(error);
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === "user") filter.user = req.user._id;
    if (req.user.role === "agent") filter.assignedAgent = req.user._id;

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

    const owner = complaint.user._id.toString() === req.user._id.toString();
    const assigned =
      complaint.assignedAgent &&
      complaint.assignedAgent._id.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !owner && !assigned) {
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
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const isAssignedAgent =
      complaint.assignedAgent &&
      complaint.assignedAgent.toString() === req.user._id.toString();

    const isOwner = complaint.user.toString() === req.user._id.toString();

    if (req.user.role === "agent" && !isAssignedAgent) {
      return res.status(403).json({ message: "Only the assigned agent can update this complaint" });
    }

    if (
      req.user.role === "user" &&
      (!isOwner || status !== "Reopened" || complaint.status !== "Resolved")
    ) {
      return res.status(403).json({ message: "Users can only reopen their own resolved complaints" });
    }

    complaint.status = status || complaint.status;
    complaint.actionLogs.push({
      status: complaint.status,
      updatedBy: req.user._id
    });

    await complaint.save();

    const updatedComplaint = await Complaint.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("assignedAgent", "name email department")
      .populate("actionLogs.updatedBy", "name role");

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

    if (
      req.user.role !== "admin" &&
      complaint.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await complaint.deleteOne();

    res.json({ message: "Complaint deleted" });
  } catch (error) {
    next(error);
  }
};