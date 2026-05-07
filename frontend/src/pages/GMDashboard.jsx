import { useState } from "react";
import {
  Badge,
  Card,
  StatCard,
  ProgressBar,
  TabBar,
  Spinner,
} from "../components/ui";
import {
  useDashboardStats,
  useAlerts,
  useDepartmentCompletion,
} from "../hooks/useQueries";
import { useUIStore } from "../store";

const TABS = [
  { value: "tasks", label: "All Tasks", icon: "☰" },
  { value: "complaints", label: "Complaints", icon: "⚠" },
  { value: "reviews", label: "Reviews", icon: "★" },
];

const badgeColorMap = {
  red: "red",
  orange: "orange",
  green: "green",
  blue: "blue",
};

function AlertItem({ alert }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-base mt-0.5">{alert.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {alert.room && (
            <span className="text-xs font-semibold text-gray-700">
              Room {alert.room} —
            </span>
          )}
          <span className="text-xs text-gray-700 font-medium truncate">
            {alert.title}
          </span>
          <Badge color={badgeColorMap[alert.badgeColor]}>{alert.badge}</Badge>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          Submitted {alert.submittedAgo} · {alert.detail}
        </p>
      </div>
    </div>
  );
}

export default function GMDashboard() {
  const { activeTab, setActiveTab } = (() => {
    const tab = useUIStore((s) => s.activeDashboardTab);
    const setTab = useUIStore((s) => s.setActiveDashboardTab);
    return { activeTab: tab, setActiveTab: setTab };
  })();

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: alerts, isLoading: alertsLoading } = useAlerts();
  const { data: departments, isLoading: deptLoading } =
    useDepartmentCompletion();

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6F0] font-sans  mx-auto">
      {/* ── Status Bar Mock ── */}
      <div className="bg-[#5C2420] px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-white">9:41 AM</span>

        <span className="text-xs text-gray-500">Fair Acres</span>
      </div>

      {/* ── Header ── */}
      <div className="bg-[#5C2420] px-4 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#8B1A4A] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">FA</span>
            </div>
            <div>
              <div className="w-3 h-3 bg-green-400 rounded-full" />
            </div>
            <span className="text-xs text-white">Fair Acres — Karen</span>
          </div>
          <span className="text-xs text-white">{dateStr}</span>
        </div>

        <h1 className="text-xl font-bold text-white mt-2">GM Dashboard</h1>
        <p className="text-xs text-white">
          Good morning, {stats?.gmName}
        </p>
      </div>

      <div className="px-4 py-4 ">
        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 gap-3 ">
          <StatCard label="TASKS DONE TODAY" value={stats?.tasksDoneToday} />
          <StatCard
            label="OPEN COMPLAINTS"
            value={stats?.openComplaints}
            highlight
          />
          <StatCard
            label="OVERDUE TASKS"
            value={stats?.overdueTasks}
            highlight
          />
          <StatCard label="STAFF ON SHIFT" value={stats?.staffOnShift} />
        </div>

        <div className="grid grid-row-3 gap-3">
          {/* ── Alerts ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3 mt-3">
              Alerts Requiring Attention
            </p>
            <Card className="p-4 mb-3">
              {alertsLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : (
                <div>
                  {alerts?.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ── Department Completion ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Department Completion Today
            </p>
            <Card className="p-4 mb-3">
              {deptLoading ? (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              ) : (
                <div className="space-y-3">
                  {departments?.map((dept) => (
                    <div key={dept.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {dept.name}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            dept.completion === 0
                              ? "text-red-500"
                              : "text-[#8B1A4A]"
                          }`}
                        >
                          {dept.completion}%
                        </span>
                      </div>
                      <ProgressBar value={dept.completion} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* ── Quick Actions ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 px-2 pt-2 mb-1">
              Quick Actions
            </p>
            <Card className="p-2">
              <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
            </Card>
          </div>

          {/* Bottom spacing for mobile */}
          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}
