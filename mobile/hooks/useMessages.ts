import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../utils/api";

export const useConversations = () => {
  const api = useApiClient();

  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get("/messages/conversations"),
    select: (response) => response.data.conversations,
  });

  return {
    conversations: conversations || [],
    isLoading,
    error,
  };
};

export const useMessages = (conversationId: string) => {
  const api = useApiClient();

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => api.get(`/messages/conversations/${conversationId}`),
    select: (response) => response.data.messages,
    enabled: !!conversationId,
  });

  return {
    messages: messages || [],
    isLoading,
    error,
  };
};

export const useSendMessage = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: string; content: string }) => {
      const response = await api.post("/messages/send", { receiverId, content });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      
      // Invalidate messages for the specific conversation
      const conversationId = data.message.conversationId;
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });

  return {
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
};

export const useMarkAsRead = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await api.put(`/messages/conversations/${conversationId}/read`);
      return response.data;
    },
    onSuccess: (data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });

  return {
    markAsRead: markAsReadMutation.mutate,
    isMarking: markAsReadMutation.isPending,
  };
};

export const useUnreadCount = () => {
  const api = useApiClient();

  const { data: unreadCount, isLoading, error } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: () => api.get("/messages/unread-count"),
    select: (response) => response.data.unreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return {
    unreadCount: unreadCount || 0,
    isLoading,
    error,
  };
};
