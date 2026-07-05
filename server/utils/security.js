const MIN_PASSWORD_LENGTH = 12;

const COMMON_PASSWORDS = new Set([
  "password",
  "password123",
  "qwerty123",
  "admin123",
  "letmein",
  "welcome123",
  "complaint123"
]);

function normalizeEmail(email = "") {
  return email.trim().toLowerCase();
}

function validatePassword(password = "", user = {}) {
  const errors = [];
  const lowerPassword = password.toLowerCase();

  if (password.length < MIN_PASSWORD_LENGTH) errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
  if (!/[a-z]/.test(password)) errors.push("Password must include a lowercase letter");
  if (!/[A-Z]/.test(password)) errors.push("Password must include an uppercase letter");
  if (!/\d/.test(password)) errors.push("Password must include a number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("Password must include a special character");
  if (/\s/.test(password)) errors.push("Password must not contain spaces");
  if (COMMON_PASSWORDS.has(lowerPassword)) errors.push("Password is too common");

  const emailName = normalizeEmail(user.email).split("@")[0];
  const nameParts = String(user.name || "")
    .toLowerCase()
    .split(/\s+/)
    .filter((part) => part.length >= 3);

  if (emailName && lowerPassword.includes(emailName)) errors.push("Password must not contain your email name");
  if (nameParts.some((part) => lowerPassword.includes(part))) errors.push("Password must not contain your name");

  return errors;
}

function sendAuthCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 2 * 60 * 60 * 1000
  });
}

module.exports = { normalizeEmail, validatePassword, sendAuthCookie };