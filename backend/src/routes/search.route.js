import express from "express";
import { search } from "../controllers/search.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { generalLimiter } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

router.get("/", protectRoute, generalLimiter, search);

export default router; 