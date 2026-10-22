import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createSchedule,
  deleteSchedule,
  getMySchedules,
  getTodaysSchedulesByDoctor,
  publishSchedule,
} from "@/api";
import { CreateSchedulePayload, type ScheduleParams } from "@/types";

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useMySchedules(params?: ScheduleParams) {
  return useQuery({
    queryKey: ["schedules", params],
    queryFn: () => getMySchedules(params),
  });
}

export const useGetMySchedules = useMySchedules;

export function useSuspenseMySchedules(params?: ScheduleParams) {
  return useSuspenseQuery({
    queryKey: ["schedules", params],
    queryFn: () => getMySchedules(params),
  });
}

export const useSuspenseGetMySchedules = useSuspenseMySchedules;

export function usePublishSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => publishSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => deleteSchedule(scheduleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
}

export function useTodaysSchedulesByDoctor(params: {
  doctorId: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["schedules", "today", params],
    queryFn: () => getTodaysSchedulesByDoctor(params),
    enabled: !!params?.doctorId,
  });
}
