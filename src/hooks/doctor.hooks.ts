import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  applyAsDoctor,
  approveDoctor,
  getAllDoctors,
  getAllPublicDoctors,
  getPublicDoctorProfile,
  getTodayScheduleByDoctor,
  verifyDoctorAccount,
} from "@/api";
import type { DoctorParams, PublicDoctorParams } from "@/types";

export function useApplyAsDoctor() {
  return useMutation({
    mutationFn: applyAsDoctor,
  });
}

export function useVerifyDoctorAccount() {
  return useMutation({
    mutationFn: verifyDoctorAccount,
  });
}

export function useGetAllDoctors(params: DoctorParams) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => getAllDoctors(params),
  });
}

export function useGetAllPublicDoctors(params: DoctorParams) {
  return useQuery({
    queryKey: ["doctor", "public", params],
    queryFn: () => getAllPublicDoctors(params),
  });
}

export function usePublicDoctorProfile(doctorId: string) {
  return useQuery({
    queryKey: ["doctor", "public", doctorId],
    queryFn: () => getPublicDoctorProfile(doctorId),
    enabled: !!doctorId,
  });
}

export function useSuspenseGetAllDoctors(params: DoctorParams) {
  return useSuspenseQuery({
    queryKey: ["doctors", params],
    queryFn: () => getAllDoctors(params),
  });
}

export function useSuspenseGetPublicDoctors(
  params?: DoctorParams | PublicDoctorParams,
) {
  return useSuspenseQuery({
    queryKey: ["doctor", "public", params],
    queryFn: () => getAllPublicDoctors(params),
  });
}

export function useApproveDoctor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}

export function useGetTodayScheduleByDoctor(params: {
  doctorId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["schedule", params],
    queryFn: () => getTodayScheduleByDoctor(params),
  });
}
