const router = require("express").Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { createComplaint, getComplaints, getComplaint, assignComplaint, updateStatus, deleteComplaint } = require("../controllers/complaintController");

router.route("/").post(protect, authorize("user", "admin"), createComplaint).get(protect, getComplaints);
router.route("/:id").get(protect, getComplaint).delete(protect, deleteComplaint);
router.put("/:id/assign", protect, authorize("admin"), assignComplaint);
router.put("/:id/status", protect, authorize("agent", "admin", "user"), updateStatus);

module.exports = router;