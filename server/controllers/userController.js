const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: "agent" }).select("-password").sort({ createdAt: -1 });
    res.json(agents);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "address", "city", "state", "pincode", "department"];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    await req.user.save();

    const user = req.user.toObject();
    delete user.password;

    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.approveAgent = async (req, res, next) => {
  try {
    const agent = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select("-password");

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  } catch (error) {
    next(error);
  }
};