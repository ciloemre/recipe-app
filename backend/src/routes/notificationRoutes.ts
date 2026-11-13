import express from "express";
import { protect } from "../middleware/authMiddleware";
import {
  listMyNotifications,
  readAllNotifications,
  readNotification,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/", protect, listMyNotifications);
router.patch("/read-all", protect, readAllNotifications);
router.patch("/:id/read", protect, readNotification);

export default router;
