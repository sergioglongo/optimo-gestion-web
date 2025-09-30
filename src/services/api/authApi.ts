import { useMutation } from '@tanstack/react-query';

import { apiClient } from './apiClient';

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData extends SignInData {
  firstname: string;
  lastname: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  password: string;
  token: string;
}

export function useSignIn() {
  return useMutation({
    mutationFn: async (data: SignInData) => {
      const response = await apiClient.post('/usuarios/auth/signin', data);
      return response.data;
    }
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await apiClient.post('/usuarios/auth/forgot-password', data);
      return response.data;
    }
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      const { token, password } = data;
      const response = await apiClient.post(`/usuarios/auth/reset-password/${token}`, { password });
      return response.data;
    }
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: async (data: SignUpData) => {
      const { firstname, lastname, ...rest } = data;
      const response = await apiClient.post('/usuarios/auth/signup', { ...rest, nombre: firstname, apellido: lastname });
      return response.data;
    }
  });
}
