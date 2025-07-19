import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../utils/api";

export const useNotifications = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.get("/notifications"),
    select: (res) => {
      // Handle the new standardized response format
      if (res.data && res.data.data && res.data.data.notifications) {
        // New format: { success: true, data: { data: { notifications: [...] } } }
        return res.data.data.notifications;
      } else if (res.data && res.data.notifications) {
        // Old format: { notifications: [...] }
        return res.data.notifications;
      } else {
        // Fallback
        return res.data || [];
      }
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => api.delete(`/notifications/${notificationId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteNotification = (notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  };

  return {
    notifications: notificationsData || [],
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteNotification,
    isDeletingNotification: deleteNotificationMutation.isPending,
  };
};
