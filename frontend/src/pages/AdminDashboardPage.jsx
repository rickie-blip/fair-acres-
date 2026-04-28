import React, { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api.js";

export default function AdminDashboardPage({ token, user }) {
  const [complaints, setComplaints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [taskDraft, setTaskDraft] = useState({ title: "", department: "Housekeeping", frequency: "daily", assigned_to: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [c, t] = await Promise.all([apiFetch("/api/complaints", { token }), apiFetch("/api/tasks", { token })]);
        if (!alive) return;
        setComplaints(c.items);
        setTasks(t.items);
      } catch (e) {
        if (alive) setError(e.message);
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const es = new EventSource(`/api/stream/events?token=${encodeURIComponent(token)}`);
    es.addEventListener("complaint_created", () => apiFetch("/api/complaints", { token }).then((d) => setComplaints(d.items)).catch(() => {}));
    es.addEventListener("complaint_status_updated", () => apiFetch("/api/complaints", { token }).then((d) => setComplaints(d.items)).catch(() => {}));
    es.addEventListener("complaint_escalated", () => {});
    es.onerror = () => {};
    return () => es.close();
  }, [token]);

  const stats = useMemo(() => {
    const s = { new: 0, urgent: 0, in_progress: 0, resolved: 0 };
    for (const c of complaints) {
      s[c.status] += 1;
      if (c.urgency === "urgent") s.urgent += 1;
    }
    return s;
  }, [complaints]);

  const setStatus = async (id, status) => {
    const updated = await apiFetch(`/api/complaints/${id}/status`, { method: "PATCH", token, body: { status } });
    setComplaints((prev) => prev.map((x) => (x.id === id ? { ...x, status: updated.status, updated_at: updated.updated_at } : x)));
  };

  const createTask = async () => {
    setCreating(true);
    try {
      const created = await apiFetch("/api/tasks", { method: "POST", token, body: taskDraft });
      setTasks((prev) => [created, ...prev]);
      setTaskDraft({ title: "", department: "Housekeeping", frequency: "daily", assigned_to: null });
    } finally {
      setCreating(false);
    }
  };

  if (!user || user.role !== "admin") return <div className="card">Please login as admin.</div>;

  return (
    <div className="col">
      {error ? (
        <div className="card" style={{ background: "rgba(239,68,68,.10)", borderColor: "rgba(239,68,68,.25)" }}>
          {error}
        </div>
      ) : null}

      <div className="card">
        <div className="row">
          <div className="col">
            <div style={{ fontWeight: 900, fontSize: 18 }}>Admin dashboard</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Real-time complaint feed + tasks</div>
          </div>
          <div className="spacer" />
          <span className="pill">New: {stats.new}</span>
          <span className="pill">Urgent: {stats.urgent}</span>
        </div>
      </div>

      <div className="grid2">
        <div className="card col">
          <div style={{ fontWeight: 900 }}>Live complaints</div>
          {complaints.slice(0, 60).map((c) => (
            <div key={c.id} className="card" style={{ background: "rgba(0,0,0,.12)" }}>
              <div className="row">
                <span className="pill">Room {c.room_number || "—"}</span>
                <span className="pill">{c.category}</span>
                <span className="pill">{c.urgency}</span>
                <div className="spacer" />
                <select className="select" value={c.status} onChange={(e) => setStatus(c.id, e.target.value)}>
                  <option value="new">new</option>
                  <option value="in_progress">in_progress</option>
                  <option value="resolved">resolved</option>
                </select>
              </div>
              <div style={{ marginTop: 8, color: "var(--text)" }}>{c.description}</div>
              {Array.isArray(c.images) && c.images.length ? (
                <div className="row" style={{ flexWrap: "wrap", marginTop: 10 }}>
                  {c.images.map((u) => (
                    <a key={u} className="pill" href={u} target="_blank" rel="noreferrer">
                      image
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          {!complaints.length ? <div style={{ color: "var(--muted)" }}>No complaints.</div> : null}
        </div>

        <div className="col" style={{ gap: 12 }}>
          <div className="card col">
            <div style={{ fontWeight: 900 }}>Assign task</div>
            <input className="input" placeholder="Task title" value={taskDraft.title} onChange={(e) => setTaskDraft((p) => ({ ...p, title: e.target.value }))} />
            <input className="input" placeholder="Department" value={taskDraft.department} onChange={(e) => setTaskDraft((p) => ({ ...p, department: e.target.value }))} />
            <input className="input" placeholder="Frequency (e.g., 30min, daily)" value={taskDraft.frequency} onChange={(e) => setTaskDraft((p) => ({ ...p, frequency: e.target.value }))} />
            <button className="btn btn-primary" onClick={createTask} disabled={creating || !taskDraft.title.trim()}>
              {creating ? "Creating…" : "Create task"}
            </button>
          </div>

          <div className="card col">
            <div style={{ fontWeight: 900 }}>Task overview</div>
            {tasks.slice(0, 80).map((t) => (
              <div key={t.id} className="row" style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
                <div className="col" style={{ gap: 2 }}>
                  <div style={{ fontWeight: 800 }}>{t.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: 12 }}>{t.department} • {t.frequency}</div>
                </div>
                <div className="spacer" />
                <span className="pill">{t.status}</span>
              </div>
            ))}
            {!tasks.length ? <div style={{ color: "var(--muted)" }}>No tasks.</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

