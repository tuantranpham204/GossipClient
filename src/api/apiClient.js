import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "sonner";
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
    config.headers["Accept-Language"] =
      localStorage.getItem("language") || "en";
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

export const handleApiResponse = async (
  request,
  options = { showToast: true },
) => {
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

    if (200 <= responseData.code && responseData.code < 300) {
      if (responseData.message && options.showToast) {
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
    } else if (responseData.status || responseData.message) {
      toast.warning(responseData.message);
      throw new Error(responseData.message || t("api.general_error"));
    } else {
      throw new Error(responseData.message || t("api.general_error"));
    }
  } catch (error) {
    if (error.response) {
      const responseData = error.response.data;
      if (error.response.status === 401) {
        toast.warning(responseData.message || t("api.unauthorized"));
        useAuthStore.getState().logout();
        throw new Error(responseData.message || t("api.unauthorized"));
      }
      if (error.response.status === 404) {
        toast.warning(responseData.message || t("api.unprocessable_content"));
        throw new Error(responseData.message || t("api.unprocessable_content"));
      }
      // For other errors, rethrow or handle specific cases
      throw new Error(responseData.message || error.message);
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
