import express from "express";
import { createPost, deletePost, getPosts, getPost, getUserPosts, likePost } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import { validatePost, handleValidationErrors } from "../middleware/validation.middleware.js";
import { postLimiter, generalLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// public routes
router.get("/", generalLimiter, getPosts);
router.get("/:postId", generalLimiter, getPost);
router.get("/user/:username", generalLimiter, getUserPosts);

// protected routes
router.post("/", protectRoute, postLimiter, upload.single("image"), validatePost, handleValidationErrors, createPost);
router.post("/:postId/like", protectRoute, generalLimiter, likePost);
router.delete("/:postId", protectRoute, generalLimiter, deletePost);

export default router;