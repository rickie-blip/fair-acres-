import express from "express";
import multer from "multer";
import { pool } from "../db/pool.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { putObject } from "../storage/s3.js";

export const taskEvidenceRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB
});

taskEvidenceRouter.post(
  "/:id/evidence",
  requireAuth,
  requireRole("staff", "admin"),
  upload.single("file"),
  async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "missing_file" });

    const taskRes = await pool.query(`SELECT * FROM tasks WHERE id=$1`, [id]);
    const task = taskRes.rows[0];
    if (!task) return res.status(404).json({ error: "not_found" });

    const isAdmin = req.user.role === "admin";
    const isAssignee = task.assigned_to && task.assigned_to === req.user.sub;
    if (!isAdmin && !isAssignee) return res.status(403).json({ error: "forbidden" });

    const allowed = new Set(["image/jpeg", "image/png", "video/mp4", "video/quicktime"]);
    if (!allowed.has(file.mimetype)) return res.status(400).json({ error: "unsupported_type" });

    const obj = await putObject({ contentType: file.mimetype, body: file.buffer, prefix: "task-evidence" });
    const out = await pool.query(
      `INSERT INTO task_evidence (task_id, file_url) VALUES ($1,$2) RETURNING *`,
      [id, obj.url]
    );

    return res.status(201).json(out.rows[0]);
  }
);

