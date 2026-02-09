import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/useAuthStore";
import apiClient, { handleApiResponse } from "../api/apiClient";
import { ROLES } from "../utils/enum";

const signUp = async (userData) => {
  return handleApiResponse(
    apiClient.post("/users/sign_up", {
      user: {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
        name: userData.name,
        surname: userData.surname,
        gender: userData.gender,
        dob: userData.dob,
      },
    }),
  );
};

const signIn = async (userData) => {
  return handleApiResponse(
    apiClient.post("/users/sign_in", {
      user: {
        email: userData.email,
        password: userData.password,
      },
    }),
  );
};

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: signUp,
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

export const useSignInMutation = () => {
  const setAuth = useAuthStore.getState().setAuth;

  return useMutation({
    mutationFn: signIn,
    onSuccess: (response) => {
      if (!response || !response.data) {
        return;
      }
      const user = {
        userId: response.data.user.user_id,
        username: response.data.user.username,
        role: response.data.user.roles?.[0] || ROLES.USER,
        name: response.data.user.name,
        surname: response.data.user.surname,
        avatarUrl: response.data.user.avatar_url,
      };
      const accessToken = response.data.token;

      setAuth(user, accessToken);
      toast.success(`Welcome back, ${response.data.user.username || "User"}!`);
    },
    onError: (error) => {
      console.error("Sign in failed:", error);
    },
  });
};
