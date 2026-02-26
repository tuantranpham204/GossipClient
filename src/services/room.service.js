import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient, { handleApiResponse } from "../api/apiClient";

export const requestPrivateRoom = async (receiverId) => {
  return handleApiResponse(
    apiClient.post(`/rooms/private/request/${receiverId}`),
  );
};

export const getPrivateRooms = async (status, page = 1, perPage = 10) => {
  return handleApiResponse(
    apiClient.get(`/rooms/private/show/${status}`, {
      params: { page, per_page: perPage },
    }),
    { showToast: false },
  );
};

export const usePrivateRooms = (status, page = 1, perPage = 10) => {
  return useQuery({
    queryKey: ["private-rooms", status, page, perPage],
    queryFn: () => getPrivateRooms(status, page, perPage),
    placeholderData: keepPreviousData,
    enabled: !!status, // Only fetch if a status is provided
  });
};
