import React, { useEffect, useState } from "react";
import { apiFetch } from "../api.js";

export default function StaffTasksPage({ token, user }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiFetch("/api/tasks", { token });
        if (mounted) setItems(data.items);
      } catch (e) {
        if (mounted) setError(e.message);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  const toggle = async (t) => {
    setBusyId(t.id);
    try {
      const next = t.status === "completed" ? "pending" : "completed";
      const updated = await apiFetch(`/api/tasks/${t.id}`, { method: "PATCH", token, body: { status: next } });
      setItems((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  };

  if (!user || (user.role !== "staff" && user.role !== "admin")) {
    return <div className="card">Please login as staff.</div>;
  }

  return (
    <div className="col">
      <div className="card row">
        <div className="col">
          <div style={{ fontWeight: 900 }}>My tasks</div>
          <div style={{ color: "var(--muted)", fontSize: 12 }}>Assigned to: {user.name}</div>
        </div>
      </div>

      {error ? (
        <div className="card" style={{ background: "rgba(239,68,68,.10)", borderColor: "rgba(239,68,68,.25)" }}>
          {error}
        </div>
      ) : null}

      {items.map((t) => (
        <div key={t.id} className="card col">
          <div className="row">
            <div className="col">
              <div style={{ fontWeight: 900 }}>{t.title}</div>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>
                {t.department} • {t.frequency}
              </div>
            </div>
            <div className="spacer" />
            <span className="pill">{t.status}</span>
          </div>
          <button className={"btn " + (t.status === "completed" ? "" : "btn-primary")} onClick={() => toggle(t)} disabled={busyId === t.id}>
            {busyId === t.id ? "Updating…" : t.status === "completed" ? "Mark pending" : "Mark completed"}
          </button>
        </div>
      ))}

      {!items.length ? <div className="card">No tasks assigned.</div> : null}
    </div>
  );
}

