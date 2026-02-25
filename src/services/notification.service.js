import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import apiClient, { handleApiResponse } from "../api/apiClient";

const getNotifications = async (params) => {
  return handleApiResponse(
    apiClient.get("/notifications/show_by_user", { params }),
    { showToast: false },
  );
};

export const useNotifications = (params) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    placeholderData: keepPreviousData,
  });
};

const readAllNotifications = async () => {
  return handleApiResponse(apiClient.patch("/notifications/read_all"));
};

export const useReadAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

const readNotification = async (id) => {
  return handleApiResponse(apiClient.patch(`/notifications/read/${id}`));
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
