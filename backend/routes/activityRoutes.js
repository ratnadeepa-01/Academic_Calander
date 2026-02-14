import { createActivity, getActivities, updateActivity } from "../controllers/activityController.js";

const router = express.Router();

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

router.post("/activity", protect, authorizeRoles("Admin", "HOD"), createActivity);
router.get("/activity", protect, getActivities);
router.put("/activity/:id", protect, updateActivity);

export default router;

