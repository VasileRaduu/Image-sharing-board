import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/responseHelper.js";

export const getConversations = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const conversations = await Conversation.find({
    participants: user._id,
  })
    .populate("participants", "userName firstName lastName profilePicture")
    .populate("lastMessage")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "userName firstName lastName profilePicture",
      },
    })
    .sort({ lastMessageAt: -1 });

  ApiResponse.success(res, { conversations });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Verify user is part of the conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: user._id,
  });

  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found" });
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversationId })
    .populate("sender", "userName firstName lastName profilePicture")
    .populate("receiver", "userName firstName lastName profilePicture")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Mark messages as read
  await Message.updateMany(
    {
      conversationId,
      receiver: user._id,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );

  ApiResponse.success(res, { messages: messages.reverse() });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { receiverId, content, messageType = "text" } = req.body;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "Message content is required" });
  }

  const sender = await User.findOne({ clerkId: userId });
  const receiver = await User.findById(receiverId);

  if (!sender || !receiver) {
    return res.status(404).json({ error: "User not found" });
  }

  // Find or create conversation
  let conversation = await Conversation.findOne({
    participants: { $all: [sender._id, receiver._id] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [sender._id, receiver._id],
    });
  }

  // Create message
  const message = await Message.create({
    conversationId: conversation._id,
    sender: sender._id,
    receiver: receiver._id,
    content: content.trim(),
    messageType,
  });

  // Update conversation
  await Conversation.findByIdAndUpdate(conversation._id, {
    lastMessage: message._id,
    lastMessageAt: new Date(),
    $inc: { [`unreadCount.${receiver._id}`]: 1 },
  });

  // Populate message with user data
  await message.populate("sender", "userName firstName lastName profilePicture");
  await message.populate("receiver", "userName firstName lastName profilePicture");

  ApiResponse.created(res, { message });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { conversationId } = req.params;

  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  await Message.updateMany(
    {
      conversationId,
      receiver: user._id,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );

  // Reset unread count
  await Conversation.findByIdAndUpdate(conversationId, {
    $set: { [`unreadCount.${user._id}`]: 0 },
  });

  ApiResponse.success(res, { message: "Messages marked as read" });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const conversations = await Conversation.find({
    participants: user._id,
  }).select("unreadCount");

  const totalUnread = conversations.reduce((total, conv) => {
    return total + (conv.unreadCount.get(user._id.toString()) || 0);
  }, 0);

  ApiResponse.success(res, { unreadCount: totalUnread });
});
