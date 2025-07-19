import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import Notification from '../models/notification.model.js';
import cloudinary from '../config/cloudinary.js';

export class PostService {
  static async getPosts(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "userName firstName lastName profilePicture email")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "userName firstName lastName profilePicture email",
        },
      });

    const totalPosts = await Post.countDocuments();
    
    return { posts, totalPosts };
  }

  static async getPost(postId) {
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid post ID format');
    }

    const post = await Post.findById(postId)
      .populate("user", "userName firstName lastName profilePicture email")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "userName firstName lastName profilePicture email",
        },
      });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }

  static async getUserPosts(username) {
    const user = await User.findOne({ userName: username });
    if (!user) {
      throw new Error('User not found');
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", "userName firstName lastName profilePicture email")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "userName firstName lastName profilePicture email",
        },
      });

    return posts;
  }

  static async createPost(userId, content, imageFile) {
    if (!content && !imageFile) {
      throw new Error('Post must contain either text or image');
    }

    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error('User not found');
    }

    let imageUrl = "";

    if (imageFile) {
      try {
        const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString("base64")}`;

        const uploadResponse = await cloudinary.uploader.upload(base64Image, {
          folder: "social_media_posts",
          resource_type: "image",
          transformation: [
            { width: 800, height: 600, crop: "limit" },
            { quality: "auto" },
            { format: "auto" },
          ],
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        throw new Error('Failed to upload image');
      }
    }

    const post = await Post.create({
      user: user._id,
      content: content || "",
      image: imageUrl,
    });

    return post;
  }

  static async likePost(userId, postId) {
    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) {
      throw new Error('User or post not found');
    }

    const isLiked = post.likes.includes(user._id);

    if (isLiked) {
      // unlike
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: user._id },
      });
    } else {
      // like
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: user._id },
      });

      // notification if it's not our post
      if (post.user.toString() !== user._id.toString()) {
        await Notification.create({
          from: user._id,
          to: post.user,
          type: "like",
          post: postId,
        });
      }
    }

    return { isLiked: !isLiked };
  }

  static async deletePost(userId, postId) {
    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) {
      throw new Error('User or post not found');
    }

    if (post.user.toString() !== user._id.toString()) {
      throw new Error('You can only delete your own posts');
    }

    // Delete all comments on this post
    await Comment.deleteMany({ post: postId });

    // Delete the post
    await Post.findByIdAndDelete(postId);

    return { success: true };
  }
} 