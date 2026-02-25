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

const getAcceptedRelations = async (relation_type, params) => {
  return handleApiResponse(
    apiClient.get(`/user_relations/accepted/${relation_type}`, { params }),
    { showToast: false },
  );
};

export const useAcceptedRelations = ({ relation_type, ...params }) => {
  return useQuery({
    queryKey: ["accepted-relations", relation_type, params],
    queryFn: () => getAcceptedRelations(relation_type, params),
    placeholderData: keepPreviousData,
  });
};

const getPendingRelations = async (relation_type, params) => {
  return handleApiResponse(
    apiClient.get(`/user_relations/pending/${relation_type}`, { params }),
    { showToast: false },
  );
};

export const usePendingRelations = ({ relation_type, ...params }) => {
  return useQuery({
    queryKey: ["pending-relations", relation_type, params],
    queryFn: () => getPendingRelations(relation_type, params),
    placeholderData: keepPreviousData,
  });
};

export const acceptRelation = async (relation_type, requester_id) => {
  return handleApiResponse(
    apiClient.patch(`/user_relations/accept/${relation_type}/${requester_id}`),
  );
};

export const declineRelation = async (relation_type, requester_id) => {
  return handleApiResponse(
    apiClient.patch(`/user_relations/decline/${relation_type}/${requester_id}`),
  );
};

export const updateUserProfile = async (data) => {
  return handleApiResponse(apiClient.patch("/profiles/update", data));
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
