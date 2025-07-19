import express from "express";
import {
  followUser,
  getCurrentUser,
  getUserProfile,
  syncUser,
  updateProfile,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  uploadProfileImage,
  uploadBannerImage,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// public routes
router.get("/profile/:username", getUserProfile);
router.get("/:userId/followers", getFollowers);
router.get("/:userId/following", getFollowing);

// protected routes
router.post("/sync", protectRoute, syncUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/profile", protectRoute, updateProfile);
router.post("/follow/:targetUserId", protectRoute, followUser);
router.get("/follow/:targetUserId/status", protectRoute, checkFollowStatus);
router.post("/upload/profile-image", protectRoute, upload.single("image"), uploadProfileImage);
router.post("/upload/banner-image", protectRoute, upload.single("image"), uploadBannerImage);

export default router;
