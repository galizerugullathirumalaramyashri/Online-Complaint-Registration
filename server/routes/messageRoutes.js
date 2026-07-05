const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { getMessages, createMessage } = require("../controllers/messageController");

router.get("/:complaintId", protect, getMessages);
router.post("/:complaintId", protect, createMessage);

module.exports = router;