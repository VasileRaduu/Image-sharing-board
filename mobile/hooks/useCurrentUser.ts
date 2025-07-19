import { useQuery } from "@tanstack/react-query";
import { useApiClient, userApi } from "../utils/api";

export const useCurrentUser = () => {
	const api = useApiClient();

	const {
		data: currentUser,
		isLoading,
		error,
		refetch,

	} = useQuery({
		queryKey: ["authUser"],
		queryFn: () => userApi.getCurrentUser(api),
		select: (response) => {
			// Handle the new standardized response format
			if (response.data && response.data.user) {
				// New format: { success: true, data: { user: {...} } }
				return response.data.user;
			} else if (response.data && response.data.data && response.data.data.user) {
				// Alternative new format: { success: true, data: { data: { user: {...} } } }
				return response.data.data.user;
			} else {
				// Fallback
				return response.data || null;
			}
		},
	});

	return { currentUser, isLoading, error, refetch };
};
