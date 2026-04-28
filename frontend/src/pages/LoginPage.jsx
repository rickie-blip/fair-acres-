import React, { useState } from "react";
import { apiFetch } from "../services/api.js";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await apiFetch("/api/auth/login", { method: "POST", body: { email, password } });
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card col">
      <div style={{ fontSize: 18, fontWeight: 900 }}>Staff & Management login</div>

      {error ? (
        <div className="card" style={{ background: "rgba(239,68,68,.10)", borderColor: "rgba(239,68,68,.25)" }}>
          {error}
        </div>
      ) : null}

      <form className="col" onSubmit={submit}>
        <div className="col">
          <label style={{ fontSize: 12, color: "var(--muted)" }}>Email</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </div>
        <div className="col">
          <label style={{ fontSize: 12, color: "var(--muted)" }}>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

