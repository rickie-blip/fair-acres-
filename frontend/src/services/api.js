export async function apiFetch(path, { method = "GET", body, token } = {}) {
  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || "request_failed");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// ── Base ──────────────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "https://api.fairacres.app";

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ── Complaints / Issues ───────────────────────────────────────────────────────
export const complaintsService = {
  getAll: () => request("/complaints"),
  getById: (id) => request(`/complaints/${id}`),
  submit: (data) =>
    request("/complaints", { method: "POST", body: JSON.stringify(data) }),
  updateStatus: (id, status) =>
    request(`/complaints/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export const dashboardService = {
  getStats: () => request("/dashboard/stats"),
  getAlerts: () => request("/dashboard/alerts"),
  getDepartmentCompletion: () => request("/dashboard/departments"),
};

// ── Rooms / QR ───────────────────────────────────────────────────────────────
export const roomsService = {
  getAll: () => request("/rooms"),
  getByNumber: (num) => request(`/rooms/${num}`),
};

// ── Staff ─────────────────────────────────────────────────────────────────────
export const staffService = {
  getOnShift: () => request("/staff/on-shift"),
};

// ── Mock data (used until backend is ready) ───────────────────────────────────
export const mockStats = {
  tasksDoneToday: 34,
  openComplaints: 3,
  overdueTasks: 2,
  staffOnShift: 8,
  gmName: "Harold",
  shiftsLeft: 4,
};

export const mockAlerts = [
  {
    id: 1,
    room: "205",
    title: "Bathroom complaint",
    badge: "Urgent",
    badgeColor: "red",
    submittedAgo: "14 min ago",
    detail: "Unresolved · Guest notified pending",
    icon: "🔴",
  },
  {
    id: 2,
    room: null,
    title: "Sewerage treatment overdue",
    badge: "Overdue 1h",
    badgeColor: "orange",
    submittedAgo: "Not submitted",
    detail: "WhatsApp sent to supervisor",
    icon: "🟡",
  },
  {
    id: 3,
    room: null,
    title: "Kitchen deep clean complete",
    badge: "Done",
    badgeColor: "green",
    submittedAgo: "07:42 AM",
    detail: "Verified ✓",
    icon: "🟢",
  },
  {
    id: 4,
    room: "12",
    title: "5-star review — Room 12 guest",
    badge: "Positive",
    badgeColor: "green",
    submittedAgo: "1h ago",
    detail: '"Excellent service, very clean room!"',
    icon: "🟢",
  },
];

export const mockDepartments = [
  { name: "Kitchen", completion: 90, color: "#8B1A4A" },
  { name: "Housekeeping", completion: 75, color: "#8B1A4A" },
  { name: "F&B", completion: 100, color: "#8B1A4A" },
  { name: "Security", completion: 50, color: "#8B1A4A" },
  { name: "Sewerage", completion: 0, color: "#ef4444" },
];

export const mockRooms = [
  { number: 12, url: "fairacres.app/r/12" },
  { number: 205, url: "fairacres.app/r/205" },
  { number: 310, url: "fairacres.app/r/310" },
];