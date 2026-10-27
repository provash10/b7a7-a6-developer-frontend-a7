"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getMyProfile,
  googleOAuth,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}

export function useVerifyAccount() {
  return useMutation({
    mutationFn: verifyAccount,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: userLogout,
  });
}

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}

export function useGetMyProfile() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMyProfile,
    retry: false,
  });
}

export const useGetMe = useGetMyProfile;
