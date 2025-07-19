import axios, { AxiosInstance } from "axios";
import { useAuth, useClerk } from "@clerk/clerk-expo";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5001/api";

// Debug logging for development
if (__DEV__) {
  console.log("🔌 API Base URL:", API_BASE_URL);
}

export const createApiClient = (getToken: () => Promise<string | null>): AxiosInstance => {
  const api = axios.create({ 
    baseURL: API_BASE_URL,
    timeout: 15000, // 15 second timeout for local development
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging for development
    if (__DEV__) {
      console.log("🚀 API Request:", config.method?.toUpperCase(), config.url);
      console.log("🔑 Auth Token:", token ? "Present" : "Missing");
    }
    
    return config;
  });

  // Response interceptor for better error handling
  api.interceptors.response.use(
    (response) => {
      if (__DEV__) {
        console.log("✅ API Response:", response.status, response.config.url);
      }
      return response;
    },
    (error) => {
      if (error.response) {
        // Server responded with error status
        console.error('❌ API Error:', error.response.status, error.response.data);
        console.error('📡 URL:', error.config?.url);
        console.error('🔑 Headers:', error.config?.headers);
      } else if (error.request) {
        // Network error
        console.error('🌐 Network Error:', error.message);
        console.error('📡 URL:', error.config?.url);
      } else {
        // Other error
        console.error('⚠️ Request Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/users/sync"),
  getCurrentUser: (api: AxiosInstance) => api.get("/users/me"),
  updateProfile: (api: AxiosInstance, data: any) => api.put("/users/profile", data),
};

export const postApi = {
  createPost: (api: AxiosInstance, data: { content: string; image?: string }) =>
    api.post("/posts", data),
  getPosts: (api: AxiosInstance) => api.get("/posts"),
  getUserPosts: (api: AxiosInstance, username: string) => api.get(`/posts/user/${username}`),
  likePost: (api: AxiosInstance, postId: string) => api.post(`/posts/${postId}/like`),
  deletePost: (api: AxiosInstance, postId: string) => api.delete(`/posts/${postId}`),
};

export const commentApi = {
  createComment: (api: AxiosInstance, postId:string, content: string) =>
  api.post(`/comments/post/${postId}`, { content }),
};
