import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../utils/api";

export const useFollow = (targetUserId: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: () => api.post(`/users/follow/${targetUserId}`),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["followStatus", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["followers", targetUserId] });
      queryClient.invalidateQueries({ queryKey: ["following", targetUserId] });
    },
  });

  const { data: followStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["followStatus", targetUserId],
    queryFn: () => api.get(`/users/follow/${targetUserId}/status`),
    select: (response) => response.data.isFollowing,
    enabled: !!targetUserId,
  });

  const toggleFollow = () => {
    followMutation.mutate();
  };

  return {
    isFollowing: followStatus || false,
    isLoading: followMutation.isPending || isLoadingStatus,
    toggleFollow,
  };
};

export const useFollowers = (userId: string) => {
  const api = useApiClient();

  const { data: followers, isLoading, error } = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => api.get(`/users/${userId}/followers`),
    select: (response) => response.data.followers,
    enabled: !!userId,
  });

  return {
    followers: followers || [],
    isLoading,
    error,
  };
};

export const useFollowing = (userId: string) => {
  const api = useApiClient();

  const { data: following, isLoading, error } = useQuery({
    queryKey: ["following", userId],
    queryFn: () => api.get(`/users/${userId}/following`),
    select: (response) => response.data.following,
    enabled: !!userId,
  });

  return {
    following: following || [],
    isLoading,
    error,
  };
};
