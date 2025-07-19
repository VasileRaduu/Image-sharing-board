import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient, postApi } from "../utils/api";

export const usePosts = (username?: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: username ? ["userPosts", username] : ["posts"],
    queryFn: () => (username ? postApi.getUserPosts(api, username) : postApi.getPosts(api)),
    select: (response) => {
      console.log("🔍 API Response structure:", {
        hasData: !!response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
        hasNestedData: response.data?.data ? Object.keys(response.data.data) : [],
        username: username || 'all posts',
      });
      
      // Handle different response formats based on endpoint
      if (username) {
        // User posts endpoint: { success: true, data: { posts: [...] } }
        if (response.data?.data?.posts && Array.isArray(response.data.data.posts)) {
          console.log("✅ User posts format - posts array length:", response.data.data.posts.length);
          return response.data.data.posts;
        }
      } else {
        // All posts endpoint: { success: true, data: { data: [...], pagination: {...} } }
        if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
          console.log("✅ All posts format - posts array length:", response.data.data.data.length);
          return response.data.data.data;
        }
      }
      
      // Fallback formats
      if (response.data?.data && Array.isArray(response.data.data)) {
        console.log("✅ Alternative format - posts array length:", response.data.data.length);
        return response.data.data;
      } else if (response.data?.posts && Array.isArray(response.data.posts)) {
        console.log("✅ Old format - posts array length:", response.data.posts.length);
        return response.data.posts;
      } else if (response.data && Array.isArray(response.data)) {
        console.log("✅ Direct array format - posts array length:", response.data.length);
        return response.data;
      } else {
        // Fallback
        console.log("⚠️ Using fallback - empty array");
        console.log("🔍 Response structure:", response.data ? Object.keys(response.data) : 'No data');
        return [];
      }
    },
  });

  const likePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.likePost(api, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["userPosts", username] });
      }
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postApi.deletePost(api, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (username) {
        queryClient.invalidateQueries({ queryKey: ["userPosts", username] });
      }
    },
  });

  const checkIsLiked = (postLikes: string[], currentUser: any) => {
    const isLiked = currentUser && postLikes.includes(currentUser._id);
    return isLiked;
  };

  return {
    posts: postsData || [],
    isLoading,
    error,
    refetch,
    toggleLike: (postId: string) => likePostMutation.mutate(postId),
    deletePost: (postId: string) => deletePostMutation.mutate(postId),
    checkIsLiked,
  };
};
