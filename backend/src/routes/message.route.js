import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  getUnreadCount,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(protectRoute);

router.get("/conversations", getConversations);
router.get("/conversations/:conversationId", getMessages);
router.post("/send", sendMessage);
router.put("/conversations/:conversationId/read", markAsRead);
router.get("/unread-count", getUnreadCount);

export default router;
