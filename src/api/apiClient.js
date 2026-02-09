import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import i18next from "../i18n/config";

const t = (key) => i18next.t(key);

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_SERVER}`,
});

// --- Request Interceptor ---
// Automatically adds the auth token to every request.
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- Response Interceptor ---
// Handles token expiration (401) and other response errors.
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/sign_in") ||
      error.config?.url?.includes("/sign_up");
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Don't logout if it's a sign_in/sign_up endpoint - those are expected to fail with 401
      if (!isAuthEndpoint) {
        console.error("Authentication Error: Logging out user.");
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);

export const handleApiResponse = async (request) => {
  try {
    const response = await request;
    const responseData = response.data;
    if (!responseData) {
      toast.error(t("api.network_error"));
      throw new Error(t("api.network_error"));
    }
    if (!responseData.code || !responseData.data) {
      toast.error(t("api.general_error"));
      throw new Error(t("api.general_error"));
    }

    if (responseData.code == 200) {
      if (responseData.message) {
        toast.success(responseData.message);
      }
      if (responseData.meta) {
        return {
          data: responseData.data,
          message: responseData.message || t("api.success"),
          meta: responseData.meta,
        };
      } else {
        return {
          data: responseData.data,
          message: responseData.message || t("api.success"),
        };
      }
    }
  } catch (error) {
    if (error.response) {
      const responseData = error.response.data;
      if (error.status == 401) {
        toast.warning(responseData.message);
        useAuthStore.getState().logout();
        return {
          message: responseData.message || t("api.unauthorized"),
        };
      }
    }

    if (error.request) {
      toast.error(`${t("api.network_error")}: ${error.message}`);
      console.error(`${t("api.network_error")}: ${error.message}`);
    } else {
      console.error(error?.message);
    }
    throw error;
  }
};

export default apiClient;
