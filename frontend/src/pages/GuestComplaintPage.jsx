import React, { useMemo, useState } from "react";
import { apiFetch } from "../services/api.js";
import { compressImageToDataUrl } from "../utils/imageCompress.js";
import { useLocation } from "react-router-dom";

function useRoomFromQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get("room") || "", [search]);
}

export default function GuestComplaintPage() {
  const roomFromQr = useRoomFromQuery();
  const [roomNumber, setRoomNumber] = useState(roomFromQr);
  const [category, setCategory] = useState("cleaning");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = description.trim().length >= 3 && !busy;

  const onPick = (e) => {
    const picked = Array.from(e.target.files || []).slice(0, 3);
    const ok = picked.filter((f) => ["image/jpeg", "image/png"].includes(f.type));
    setFiles(ok);
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      let imageUrls = [];
      if (files.length) {
        const compressed = [];
        for (const f of files) {
          const c = await compressImageToDataUrl(f, { maxSize: 1280, quality: 0.75 });
          compressed.push({ data_url: c.dataUrl });
        }
        const up = await apiFetch("/api/uploads", { method: "POST", body: { files: compressed } });
        imageUrls = up.items.map((x) => x.url).slice(0, 3);
      }

      await apiFetch("/api/complaints", {
        method: "POST",
        body: {
          room_number: roomNumber || null,
          category,
          description,
          urgency,
          images: imageUrls
        }
      });
      setDone(true);
    } catch (err) {
      setError(err.data?.details?.join(", ") || err.message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="card">
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>Message received</div>
        <div style={{ color: "var(--muted)", marginBottom: 14 }}>
          Your issue has been received. Our team is working on it.
        </div>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Submit another issue
        </button>
      </div>
    );
  }

  return (
    <form className="card col" onSubmit={submit}>
      <div style={{ fontSize: 18, fontWeight: 900 }}>Guest complaint / feedback</div>
      <div style={{ color: "var(--muted)", fontSize: 13 }}>
        Scan-and-send only. No login. You won’t be able to view submissions after sending.
      </div>

      {error ? (
        <div className="card" style={{ background: "rgba(239,68,68,.10)", borderColor: "rgba(239,68,68,.25)" }}>
          {error}
        </div>
      ) : null}

      <div className="grid2">
        <div className="col">
          <label style={{ fontSize: 12, color: "var(--muted)" }}>Room number (optional)</label>
          <input className="input" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="e.g. 402" />
        </div>

        <div className="col">
          <label style={{ fontSize: 12, color: "var(--muted)" }}>Category</label>
          <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="cleaning">Cleaning</option>
            <option value="bathroom">Bathroom</option>
            <option value="smell">Smell</option>
            <option value="service">Service</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="col">
        <label style={{ fontSize: 12, color: "var(--muted)" }}>Description *</label>
        <textarea
          className="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue…"
          required
        />
      </div>

      <div className="col">
        <label style={{ fontSize: 12, color: "var(--muted)" }}>Urgency</label>
        <div className="row">
          <button type="button" className={"btn " + (urgency === "normal" ? "btn-primary" : "")} onClick={() => setUrgency("normal")}>
            Normal
          </button>
          <button type="button" className={"btn " + (urgency === "urgent" ? "btn-danger" : "")} onClick={() => setUrgency("urgent")}>
            Urgent
          </button>
          <div className="spacer" />
          <span className="pill">Max 3 images</span>
        </div>
      </div>

      <div className="col">
        <label style={{ fontSize: 12, color: "var(--muted)" }}>Images (JPG/PNG)</label>
        <input type="file" accept="image/jpeg,image/png" multiple onChange={onPick} />
        {files.length ? <div style={{ color: "var(--muted)", fontSize: 12 }}>{files.length} selected</div> : null}
      </div>

      <button className="btn btn-primary" disabled={!canSubmit}>
        {busy ? "Sending…" : "Submit complaint"}
      </button>
    </form>
  );
}

