import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

import { clerkClient, getAuth } from "@clerk/express";

export const getUserProfile = asyncHandler(async (req, res) => {
	const { username } = req.params;
	const user = await User.findOne({ username });
	if (!user) return res.status(404).json({ error: "User not found" });

	res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
	const { userId } = getAuth(req);

	const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, { new: true });
 
	if (!user) return res.status(404).json({ error: "User not found" });

	res.status(200).json({ user });
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

  if (userId === targetUserId) return res.status(400).json({ error: "You cannot follow yourself" });

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" });

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUser._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  res.status(200).json({
    message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
  });
});