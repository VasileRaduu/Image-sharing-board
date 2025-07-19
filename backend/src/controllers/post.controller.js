import asyncHandler from "express-async-handler";
import { getAuth } from "@clerk/express";
import { PostService } from "../services/post.service.js";
import { ApiResponse, createPaginationResponse } from "../utils/responseHelper.js";

export const getPosts = asyncHandler(async (req, res) => {
	try {
		const { page = 1, limit = 10 } = req.query;
		const { posts, totalPosts } = await PostService.getPosts(page, limit);
		
		const response = createPaginationResponse(posts, page, limit, totalPosts);
		ApiResponse.success(res, response);
	} catch (error) {
		console.error("Error fetching posts:", error);
		ApiResponse.internalError(res, "Failed to fetch posts");
	}
});


export const getPost = asyncHandler(async (req, res) => {
	try {
		const { postId } = req.params;
		const post = await PostService.getPost(postId);
		ApiResponse.success(res, { post });
	} catch (error) {
		console.error("Error fetching post:", error);
		if (error.message === 'Invalid post ID format') {
			ApiResponse.badRequest(res, error.message);
		} else if (error.message === 'Post not found') {
			ApiResponse.notFound(res, error.message);
		} else {
			ApiResponse.internalError(res, "Failed to fetch post");
		}
	}
 });

export const getUserPosts = asyncHandler(async (req, res) => {
	try {
		const { username } = req.params;
		const posts = await PostService.getUserPosts(username);
		ApiResponse.success(res, { posts });
	} catch (error) {
		console.error("Error fetching user posts:", error);
		if (error.message === 'User not found') {
			ApiResponse.notFound(res, error.message);
		} else {
			ApiResponse.internalError(res, "Failed to fetch user posts");
		}
	}
});

export const createPost = asyncHandler(async (req, res) => {
	try {
		const { userId } = getAuth(req);
		const { content } = req.body;
		const imageFile = req.file;

		const post = await PostService.createPost(userId, content, imageFile);
		ApiResponse.created(res, { post });
	} catch (error) {
		console.error("Error creating post:", error);
		if (error.message === 'Post must contain either text or image') {
			ApiResponse.badRequest(res, error.message);
		} else if (error.message === 'User not found') {
			ApiResponse.notFound(res, error.message);
		} else if (error.message === 'Failed to upload image') {
			ApiResponse.badRequest(res, error.message);
		} else {
			ApiResponse.internalError(res, "Failed to create post");
		}
	}
});

export const likePost = asyncHandler(async (req, res) => {
	try {
		const { userId } = getAuth(req);
		const { postId } = req.params;

		const result = await PostService.likePost(userId, postId);
		const message = result.isLiked ? "Post liked successfully" : "Post unliked successfully";
		ApiResponse.success(res, { message });
	} catch (error) {
		console.error("Error liking/unliking post:", error);
		if (error.message === 'User or post not found') {
			ApiResponse.notFound(res, error.message);
		} else {
			ApiResponse.internalError(res, "Failed to like/unlike post");
		}
	}
});

export const deletePost = asyncHandler(async (req, res) => {
	try {
		const { userId } = getAuth(req);
		const { postId } = req.params;

		await PostService.deletePost(userId, postId);
		ApiResponse.success(res, { message: "Post deleted successfully" });
	} catch (error) {
		console.error("Error deleting post:", error);
		if (error.message === 'User or post not found') {
			ApiResponse.badRequest(res, error.message);
		} else if (error.message === 'You can only delete your own posts') {
			ApiResponse.forbidden(res, error.message);
		} else {
			ApiResponse.internalError(res, "Failed to delete post");
		}
	}
});