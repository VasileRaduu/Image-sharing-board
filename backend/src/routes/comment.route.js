import express from "express";
import { protectRoute  } from "../middleware/auth.middleware";
import { createComment, getComments, deleteComments } from "../controllers/comment.controller.js";

const router = express.Router();

//public routes
router.get("/post/:postId", getComments);

//protected routes
router.post("/post/:postId", protectRoute, createComment);
router.delete("/:commentId", protectRoute, deleteComments);

export default router;