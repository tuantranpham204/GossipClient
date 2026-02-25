import apiClient, { handleApiResponse } from "../api/apiClient";

export const requestPrivateRoom = async (receiverId) => {
  return handleApiResponse(
    apiClient.post(`/rooms/private/request/${receiverId}`),
  );
};
