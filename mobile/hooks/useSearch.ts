import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../utils/api";

export const useSearchUsers = (query: string, enabled: boolean = true) => {
  const api = useApiClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchUsers", query],
    queryFn: () => api.get(`/search/users?q=${encodeURIComponent(query)}`),
    select: (response) => response.data.users,
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    users: data || [],
    isLoading,
    error,
  };
};

export const useSearchPosts = (query: string, enabled: boolean = true) => {
  const api = useApiClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchPosts", query],
    queryFn: () => api.get(`/search/posts?q=${encodeURIComponent(query)}`),
    select: (response) => response.data.posts,
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    posts: data || [],
    isLoading,
    error,
  };
};

export const useSearch = (query: string, type?: "users" | "posts", enabled: boolean = true) => {
  const api = useApiClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["search", query, type],
    queryFn: () => {
      const params = new URLSearchParams({ q: query });
      if (type) params.append("type", type);
      return api.get(`/search?${params.toString()}`);
    },
    select: (response) => response.data,
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    posts: data?.posts || [],
    users: data?.users || [],
    pagination: data?.pagination,
    isLoading,
    error,
  };
};
