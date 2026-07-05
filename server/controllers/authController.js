const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { normalizeEmail, sendAuthCookie, validatePassword } = require("../utils/security");

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

const generateToken = (user) => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set to at least 32 characters");
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, password, phone, department, adminCode } = req.body;
    const email = normalizeEmail(req.body.email);
    const role = ["user", "agent", "admin"].includes(req.body.role) ? req.body.role : "user";
    const passwordErrors = validatePassword(password, { name, email });

    if (passwordErrors.length) {
      return res.status(400).json({ message: passwordErrors.join(". ") });
    }

    if (
      role === "admin" &&
      (!process.env.ADMIN_REGISTRATION_CODE || adminCode !== process.env.ADMIN_REGISTRATION_CODE)
    ) {
      return res.status(403).json({ message: "A valid admin registration code is required" });
    }

    if (role === "agent" && !department?.trim()) {
      return res.status(400).json({ message: "Department is required for officer registration" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      department: role === "agent" ? department.trim() : ""
    });

    res.status(201).json({
      message:
        role === "agent"
          ? "Registration successful. Your agent account is awaiting admin approval."
          : "Registration successful. Please login.",
      user: sanitize(user)
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;
    const user = await User.findOne({ email }).select("+password +loginAttempts +lockUntil");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(423).json({ message: "Account temporarily locked. Please try again later." });
    }

    if (!(await user.matchPassword(password))) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME_MS);
        user.loginAttempts = 0;
      }

      await user.save();
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.role === "agent" && !user.isApproved) {
      return res.status(403).json({ message: "Agent account awaiting admin approval" });
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);
    sendAuthCookie(res, token);

    res.json({ token, user: sanitize(user) });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

function sanitize(user) {
  const data = user.toObject ? user.toObject() : user;
  delete data.password;
  return data;
}