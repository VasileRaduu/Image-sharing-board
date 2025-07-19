import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { ApiResponse, createPaginationResponse } from "../utils/responseHelper.js";

export const searchUsers = asyncHandler(async (req, res) => {
  try {
    const { q: query, page = 1, limit = 20 } = req.query;

    if (!query || query.trim().length === 0) {
      return ApiResponse.success(res, { 
        users: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: parseInt(limit),
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }

    const searchQuery = query.trim();
    const skip = (page - 1) * limit;
    
    const searchRegex = new RegExp(searchQuery, 'i');
    const userQuery = {
      $or: [
        { userName: { $regex: searchRegex } },
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } },
      ]
    };

    const users = await User.find(userQuery)
      .select("userName firstName lastName profilePicture")
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(userQuery);
    
    const response = createPaginationResponse(users, page, limit, totalUsers);
    ApiResponse.success(res, { users: response.data, pagination: response.pagination });
  } catch (error) {
    console.error("Search users error:", error);
    ApiResponse.internalError(res, "Failed to search users");
  }
});

export const searchPosts = asyncHandler(async (req, res) => {
  try {
    const { q: query, page = 1, limit = 20 } = req.query;

    if (!query || query.trim().length === 0) {
      return ApiResponse.success(res, { 
        posts: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: parseInt(limit),
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }

    const searchQuery = query.trim();
    const skip = (page - 1) * limit;
    
    // Use text search if available, otherwise use regex
    const useTextSearch = searchQuery.length >= 3;
    
    let postQuery = {};
    
    if (useTextSearch) {
      postQuery = { $text: { $search: searchQuery } };
    } else {
      const searchRegex = new RegExp(searchQuery, 'i');
      postQuery = { content: { $regex: searchRegex } };
    }

    const posts = await Post.find(postQuery)
      .populate("user", "userName firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "userName firstName lastName profilePicture",
        },
      })
      .sort(useTextSearch ? { score: { $meta: "textScore" } } : { createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalPosts = await Post.countDocuments(postQuery);
    
    const response = createPaginationResponse(posts, page, limit, totalPosts);
    ApiResponse.success(res, { posts: response.data, pagination: response.pagination });
  } catch (error) {
    console.error("Search posts error:", error);
    ApiResponse.internalError(res, "Failed to search posts");
  }
});

export const search = asyncHandler(async (req, res) => {
  try {
    const { q: query, type, page = 1, limit = 20 } = req.query;

    if (!query || query.trim().length === 0) {
      return ApiResponse.success(res, { 
        posts: [], 
        users: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: parseInt(limit),
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }

    const searchQuery = query.trim();
    const skip = (page - 1) * limit;
    const results = {};

    // Use text search if available, otherwise use regex
    const useTextSearch = searchQuery.length >= 3;

    // Search for posts
    if (!type || type === 'posts') {
      let postQuery = {};
      
      if (useTextSearch) {
        postQuery = { $text: { $search: searchQuery } };
      } else {
        const searchRegex = new RegExp(searchQuery, 'i');
        postQuery = { content: { $regex: searchRegex } };
      }

      const posts = await Post.find(postQuery)
        .populate("user", "userName firstName lastName profilePicture")
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "userName firstName lastName profilePicture",
          },
        })
        .sort(useTextSearch ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const totalPosts = await Post.countDocuments(postQuery);
      
      results.posts = posts;
      results.postCount = totalPosts;
    }

    // Search for users
    if (!type || type === 'users') {
      const searchRegex = new RegExp(searchQuery, 'i');
      const userQuery = {
        $or: [
          { userName: { $regex: searchRegex } },
          { firstName: { $regex: searchRegex } },
          { lastName: { $regex: searchRegex } },
        ]
      };

      const users = await User.find(userQuery)
        .select("userName firstName lastName profilePicture")
        .skip(skip)
        .limit(parseInt(limit));

      const totalUsers = await User.countDocuments(userQuery);
      
      results.users = users;
      results.userCount = totalUsers;
    }

    // Calculate pagination
    const totalResults = (results.postCount || 0) + (results.userCount || 0);
    const totalPages = Math.ceil(totalResults / limit);

    ApiResponse.success(res, {
      posts: results.posts || [],
      users: results.users || [],
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: totalResults,
        itemsPerPage: parseInt(limit),
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Search error:", error);
    ApiResponse.internalError(res, "Failed to perform search");
  }
});
