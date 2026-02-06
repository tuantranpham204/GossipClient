import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";
import apiClient, { handleApiResponse } from "../api/apiClient.js";

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

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: signUp,
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};
