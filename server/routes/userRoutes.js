const router = require("express").Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getUsers, getAgents, updateProfile, approveAgent } = require("../controllers/userController");

router.get("/", protect, authorize("admin"), getUsers);
router.get("/agents", protect, authorize("admin"), getAgents);
router.put("/profile", protect, updateProfile);
router.put("/agents/:id/approve", protect, authorize("admin"), approveAgent);

module.exports = router;