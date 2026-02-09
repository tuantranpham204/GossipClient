import { UseMutationResult } from "@tanstack/react-query";

interface SignInFormValues {
  email?: string;
  password?: string;
}

interface SignUpFormValues {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  name?: string;
  surname?: string;
  gender?: number;
  dob?: Date | string;
}

export const useSignUpMutation: () => UseMutationResult<any, Error, SignUpFormValues>;
export const useSignInMutation: () => UseMutationResult<any, Error, SignInFormValues>;
export const useSignOutMutation: () => UseMutationResult<any, Error, void>;
