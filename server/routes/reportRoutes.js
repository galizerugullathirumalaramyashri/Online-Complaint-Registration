const router = require("express").Router();

const { protect, authorize } = require("../middleware/authMiddleware");
const { getReportSummary } = require("../controllers/reportController");

router.get("/summary", protect, authorize("admin"), getReportSummary);

module.exports = router;