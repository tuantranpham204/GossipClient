import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient, { handleApiResponse } from "../api/apiClient";

const searchUsers = async (params) => {
  return handleApiResponse(apiClient.get("/profiles/search", { params }), {
    showToast: false,
  });
};

const getUserProfile = async (userId) => {
  return handleApiResponse(apiClient.get(`/profiles/${userId}`), {
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

export const useUserProfile = (userId, options = {}) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    ...options,
  });
};

export const updateProfileImage = async (type, file) => {
  const formData = new FormData();
  formData.append("image", file);

  return handleApiResponse(
    apiClient.patch(`/profiles/update_images/${type}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};
export const useProfileImage = (type, userId, options = {}) => {
  return useQuery({
    queryKey: ["profile-image", type, userId],
    queryFn: async () => {
      return await handleApiResponse(
        apiClient.get(`/profiles/get_images/${type}/${userId}`),
        {
          showToast: false,
        },
      );
    },
    enabled: !!userId,
    ...options,
  });
};

export const updateUserProfile = async (data) => {
  return handleApiResponse(apiClient.put("/profiles/update", data));
};

export const requestFriend = async (receiverId) => {
  return handleApiResponse(
    apiClient.post(`/user_relations/friend/${receiverId}`),
  );
};

export const requestFollow = async (receiverId) => {
  return handleApiResponse(
    apiClient.post(`/user_relations/follow/${receiverId}`),
  );
};
