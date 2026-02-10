import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient, { handleApiResponse } from "../api/apiClient";

const searchUsers = async (params) => {
  return handleApiResponse(apiClient.get("/profiles/search", { params }), {
    showToast: false,
  });
};

export const useSearchUsers = (params) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => searchUsers(params),
    placeholderData: keepPreviousData,
  });
};

export const getUserProfile = async (userId) => {
  return handleApiResponse(apiClient.get(`/profiles/${userId}`), {
    showToast: false,
  });
};

export const useUserProfile = (userId, options = {}) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    ...options,
  });
};
