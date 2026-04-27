import express from "express";
import rateLimit from "express-rate-limit";
import { pool } from "../db/pool.js";
import { complaintCreateSchema, complaintStatusPatchSchema } from "../validation/schemas.js";
import { validate } from "../utils/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { publish } from "../notifications/bus.js";

export const complaintsRouter = express.Router();

const guestLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20
});

// Public (Guest via QR): POST /api/complaints
complaintsRouter.post("/", guestLimiter, async (req, res) => {
  const v = validate(complaintCreateSchema, req.body ?? {});
  if (!v.ok) return res.status(400).json(v);
  const { room_number, category, description, urgency, images } = v.value;

  const complaintRes = await pool.query(
    `
    INSERT INTO complaints (room_number, category, description, urgency, status)
    VALUES ($1,$2,$3,$4,'new')
    RETURNING id, room_number, category, description, urgency, status, created_at, updated_at
    `,
    [room_number ?? null, category, description, urgency]
  );
  const complaint = complaintRes.rows[0];

  const imageUrls = Array.isArray(images) ? images.slice(0, 3) : [];
  for (const url of imageUrls) {
    await pool.query(
      `INSERT INTO complaint_images (complaint_id, image_url) VALUES ($1,$2)`,
      [complaint.id, url]
    );
  }

  await pool.query(
    `INSERT INTO notifications (type, severity, message, complaint_id) VALUES ($1,$2,$3,$4)`,
    [
      urgency === "urgent" ? "complaint_urgent" : "complaint_new",
      urgency === "urgent" ? "critical" : "info",
      urgency === "urgent"
        ? `URGENT complaint received${room_number ? ` (room ${room_number})` : ""}`
        : `New complaint received${room_number ? ` (room ${room_number})` : ""}`,
      complaint.id
    ]
  );

  publish({ type: "complaint_created", complaint_id: complaint.id, urgency, created_at: complaint.created_at });

  return res.json({
    ok: true,
    message: "Your issue has been received. Our team is working on it."
  });
});

// Protected: GET /api/complaints (admin: all, staff: currently all; can be narrowed later)
complaintsRouter.get("/", requireAuth, requireRole("staff", "admin"), async (_req, res) => {
  const out = await pool.query(
    `
    SELECT c.*,
      COALESCE(
        json_agg(ci.image_url) FILTER (WHERE ci.image_url IS NOT NULL),
        '[]'::json
      ) AS images
    FROM complaints c
    LEFT JOIN complaint_images ci ON ci.complaint_id = c.id
    GROUP BY c.id
    ORDER BY c.created_at DESC
    LIMIT 200
    `
  );
  return res.json({ items: out.rows });
});

complaintsRouter.get("/:id", requireAuth, requireRole("staff", "admin"), async (req, res) => {
  const { id } = req.params;
  const out = await pool.query(
    `
    SELECT c.*,
      COALESCE(
        json_agg(ci.image_url) FILTER (WHERE ci.image_url IS NOT NULL),
        '[]'::json
      ) AS images
    FROM complaints c
    LEFT JOIN complaint_images ci ON ci.complaint_id = c.id
    WHERE c.id=$1
    GROUP BY c.id
    `,
    [id]
  );
  const row = out.rows[0];
  if (!row) return res.status(404).json({ error: "not_found" });
  return res.json(row);
});

complaintsRouter.patch("/:id/status", requireAuth, requireRole("admin", "staff"), async (req, res) => {
  const v = validate(complaintStatusPatchSchema, req.body ?? {});
  if (!v.ok) return res.status(400).json(v);
  const { id } = req.params;
  const { status } = v.value;

  const out = await pool.query(
    `
    UPDATE complaints
    SET status=$2, updated_at=now()
    WHERE id=$1
    RETURNING *
    `,
    [id, status]
  );
  const row = out.rows[0];
  if (!row) return res.status(404).json({ error: "not_found" });

  publish({ type: "complaint_status_updated", complaint_id: id, status });
  return res.json(row);
});

