import express from "express";
import { search, searchUsers, searchPosts } from "../controllers/search.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { generalLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.get("/", protectRoute, generalLimiter, search);
router.get("/users", protectRoute, generalLimiter, searchUsers);
router.get("/posts", protectRoute, generalLimiter, searchPosts);

export default router;
