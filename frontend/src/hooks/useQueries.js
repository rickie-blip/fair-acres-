import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  complaintsService,
  dashboardService,
  roomsService,
  staffService,
  mockStats,
  mockAlerts,
  mockDepartments,
  mockRooms,
} from "../services/api";

// Toggle this to switch between mock and live API
const USE_MOCK = true;

// ── Dashboard ─────────────────────────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: USE_MOCK ? () => mockStats : dashboardService.getStats,
    refetchInterval: 30_000,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["dashboard", "alerts"],
    queryFn: USE_MOCK ? () => mockAlerts : dashboardService.getAlerts,
    refetchInterval: 15_000,
  });
}

export function useDepartmentCompletion() {
  return useQuery({
    queryKey: ["dashboard", "departments"],
    queryFn: USE_MOCK
      ? () => mockDepartments
      : dashboardService.getDepartmentCompletion,
  });
}

// ── Complaints ────────────────────────────────────────────────────────────────
export function useComplaints() {
  return useQuery({
    queryKey: ["complaints"],
    queryFn: complaintsService.getAll,
    enabled: !USE_MOCK,
  });
}

export function useSubmitComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: complaintsService.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => complaintsService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ── Rooms ─────────────────────────────────────────────────────────────────────
export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: USE_MOCK ? () => mockRooms : roomsService.getAll,
  });
}

export function useRoom(roomNumber) {
  return useQuery({
    queryKey: ["rooms", roomNumber],
    queryFn: () => roomsService.getByNumber(roomNumber),
    enabled: !!roomNumber && !USE_MOCK,
  });
}

// ── Staff ─────────────────────────────────────────────────────────────────────
export function useStaffOnShift() {
  return useQuery({
    queryKey: ["staff", "on-shift"],
    queryFn: staffService.getOnShift,
    enabled: !USE_MOCK,
  });
}
