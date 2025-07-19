import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const search = asyncHandler(async (req, res) => {
  const { q: query } = req.query;

  if (!query || query.trim().length === 0) {
    return res.status(200).json({ posts: [], users: [] });
  }

  const searchRegex = new RegExp(query.trim(), 'i');

  // Search for posts
  const posts = await Post.find({
    $or: [
      { content: { $regex: searchRegex } },
    ]
  })
  .populate("user", "username firstName lastName profilePicture")
  .populate({
    path: "comments",
    populate: {
      path: "user",
      select: "username firstName lastName profilePicture",
    },
  })
  .sort({ createdAt: -1 })
  .limit(20);

  // Search for users
  const users = await User.find({
    $or: [
      { username: { $regex: searchRegex } },
      { firstName: { $regex: searchRegex } },
      { lastName: { $regex: searchRegex } },
    ]
  })
  .select("username firstName lastName profilePicture")
  .limit(10);

  res.status(200).json({
    posts,
    users,
  });
}); 