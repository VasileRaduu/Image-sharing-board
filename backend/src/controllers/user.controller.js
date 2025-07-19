import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { ApiResponse } from "../utils/responseHelper.js";
import cloudinary from "../config/cloudinary.js";

import { clerkClient, getAuth } from "@clerk/express";

export const getUserProfile = asyncHandler(async (req, res) => {
	const { username } = req.params;
	const user = await User.findOne({ userName: username })
		.populate("followers", "userName firstName lastName profilePicture")
		.populate("following", "userName firstName lastName profilePicture");
	
	if (!user) return res.status(404).json({ error: "User not found" });

	res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
	const { userId } = getAuth(req);

	const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, { new: true });
 
	if (!user) return res.status(404).json({ error: "User not found" });

	res.status(200).json({ user });
});

export const uploadProfileImage = asyncHandler(async (req, res) => {
	const { userId } = getAuth(req);
	const imageFile = req.file;

	if (!imageFile) {
		return res.status(400).json({ error: "No image file provided" });
	}

	try {
		const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

		const uploadResponse = await cloudinary.uploader.upload(base64Image, {
			folder: "profile_images",
			resource_type: "image",
			transformation: [
				{ width: 400, height: 400, crop: "fill", gravity: "face" },
				{ quality: "auto" },
				{ format: "auto" },
			],
		});

		const user = await User.findOneAndUpdate(
			{ clerkId: userId },
			{ profilePicture: uploadResponse.secure_url },
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		ApiResponse.success(res, { 
			message: "Profile image updated successfully",
			profilePicture: uploadResponse.secure_url 
		});
	} catch (error) {
		console.error("Error uploading profile image:", error);
		ApiResponse.internalError(res, "Failed to upload profile image");
	}
});

export const uploadBannerImage = asyncHandler(async (req, res) => {
	const { userId } = getAuth(req);
	const imageFile = req.file;

	if (!imageFile) {
		return res.status(400).json({ error: "No image file provided" });
	}

	try {
		const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

		const uploadResponse = await cloudinary.uploader.upload(base64Image, {
			folder: "banner_images",
			resource_type: "image",
			transformation: [
				{ width: 1200, height: 400, crop: "fill" },
				{ quality: "auto" },
				{ format: "auto" },
			],
		});

		const user = await User.findOneAndUpdate(
			{ clerkId: userId },
			{ bannerImage: uploadResponse.secure_url },
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		ApiResponse.success(res, { 
			message: "Banner image updated successfully",
			bannerImage: uploadResponse.secure_url 
		});
	} catch (error) {
		console.error("Error uploading banner image:", error);
		ApiResponse.internalError(res, "Failed to upload banner image");
	}
});

export const syncUser = asyncHandler(async (req, res) => {
  console.log("🔄 syncUser called");
  
  try {
    // Step 1: Get user ID
    const { userId } = getAuth(req);
    console.log("✅ User ID extracted:", userId);
    
    if (!userId) {
      console.error("❌ No userId found");
      return res.status(401).json({ error: "No user ID found" });
    }

    // Step 2: Check database connection
    console.log(" MongoDB connection state:", mongoose.connection.readyState);
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB not connected");
      return res.status(500).json({ error: "Database not connected" });
    }

    // Step 3: Check for existing user
    console.log("🔍 Checking for existing user...");
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
      console.log("✅ User already exists:", existingUser._id);
      return res.status(200).json({ user: existingUser, message: "User already exists" });
    }

    // Step 4: Get Clerk user data
    console.log("📋 Fetching Clerk user data...");
    const clerkUser = await clerkClient.users.getUser(userId);
    console.log("✅ Clerk user data received:", {
      id: clerkUser.id,
      emailAddresses: clerkUser.emailAddresses?.length || 0,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName
    });

    // Step 5: Validate email addresses
    if (!clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
      console.error("❌ No email addresses found");
      return res.status(400).json({ error: "User has no email address" });
    }

    // Step 6: Prepare user data
    const userData = {
      clerkId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      userName: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
      profilePicture: clerkUser.imageUrl || "",
    };
    console.log(" User data prepared:", userData);

    // Step 7: Save to database
    console.log("💾 Saving user to database...");
    const user = await User.create(userData);
    console.log("✅ User saved successfully:", user._id);

    res.status(201).json({ user, message: "User created successfully" });
    
  } catch (error) {
    console.error("❌ syncUser error:", error.message);
    console.error("❌ Error stack:", error.stack);
    console.error("❌ Error name:", error.name);
    
    // Handle specific errors
    if (error.code === 11000) {
      return res.status(409).json({ error: "User already exists" });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation failed", details: error.message });
    }
    
    throw error;
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
	const { userId } = getAuth(req);
	const user = await User.findOne({ clerkId: userId });

	if (!user) return res.status(404).json({ error: "User not found" });

	res.status(200).json({ user });
});

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetUserId } = req.params;

  if (userId === targetUserId) {
    return res.status(400).json({ error: "You cannot follow yourself" });
  }

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const isFollowing = currentUser.following.includes(targetUser._id);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUser._id },
    });
    await User.findByIdAndUpdate(targetUser._id, {
      $pull: { followers: currentUser._id },
    });

    // Remove notification if exists
    await Notification.findOneAndDelete({
      from: currentUser._id,
      to: targetUser._id,
      type: "follow",
    });

    ApiResponse.success(res, { 
      message: "User unfollowed successfully",
      isFollowing: false 
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetUser._id },
    });
    await User.findByIdAndUpdate(targetUser._id, {
      $push: { followers: currentUser._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUser._id,
      type: "follow",
    });

    ApiResponse.success(res, { 
      message: "User followed successfully",
      isFollowing: true 
    });
  }
});

export const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const user = await User.findById(userId)
    .populate("followers", "userName firstName lastName profilePicture")
    .select("followers");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  ApiResponse.success(res, { followers: user.followers });
});

export const getFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const user = await User.findById(userId)
    .populate("following", "userName firstName lastName profilePicture")
    .select("following");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  ApiResponse.success(res, { following: user.following });
});

export const checkFollowStatus = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetUserId } = req.params;

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const isFollowing = currentUser.following.includes(targetUser._id);

  ApiResponse.success(res, { isFollowing });
});
