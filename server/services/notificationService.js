const nodemailer = require("nodemailer");
const twilio = require("twilio");
const Notification = require("../models/Notification");

function emailTransport() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

async function sendEmail(to, subject, text) {
  const transport = emailTransport();
  if (!transport || !to) return false;
  await transport.sendMail({ from: process.env.EMAIL_FROM || process.env.SMTP_USER, to, subject, text });
  return true;
}

async function sendSms(to, text) {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER || !to) return false;
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.messages.create({ from: process.env.TWILIO_PHONE_NUMBER, to, body: text });
  return true;
}

// In-app notifications are always saved. Email/SMS are optional and never block the complaint action.
async function notify({ recipient, complaint, type, title, message, channels = ["inApp"] }) {
  const item = await Notification.create({ recipient: recipient._id || recipient, complaint, type, title, message });
  if (channels.includes("email")) {
    try { item.delivered.email = await sendEmail(recipient.email, title, message); } catch (error) { console.error("Email notification failed:", error.message); }
  }
  if (channels.includes("sms")) {
    try { item.delivered.sms = await sendSms(recipient.phone, message); } catch (error) { console.error("SMS notification failed:", error.message); }
  }
  await item.save();
  return item;
}

module.exports = { notify };
