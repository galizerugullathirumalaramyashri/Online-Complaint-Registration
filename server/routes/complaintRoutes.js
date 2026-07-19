const router = require("express").Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createComplaint,
  getComplaints,
  getComplaint,
  assignComplaint,
  updateStatus,
  deleteComplaint
} = require("../controllers/complaintController");

router
  .route("/")
  .post(
    protect,
    authorize("user"),
    upload.single("attachment"),
    createComplaint
  )
  .get(protect, getComplaints);

router
  .route("/:id")
  .get(protect, getComplaint)
  .delete(protect, authorize("admin"), deleteComplaint);

router.put("/:id/assign", protect, authorize("admin"), assignComplaint);

router.put("/:id/status", protect, authorize("agent"), updateStatus);

module.exports = router;