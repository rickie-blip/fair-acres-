import express from "express";
import { pool } from "../db/pool.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { taskCreateSchema, taskPatchSchema } from "../validation/schemas.js";
import { validate } from "../utils/validate.js";

export const tasksRouter = express.Router();

// Staff: only assigned tasks. Admin: all.
tasksRouter.get("/", requireAuth, requireRole("staff", "admin"), async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const out = isAdmin
    ? await pool.query(
        `
        SELECT t.*, u.name as assignee_name
        FROM tasks t
        LEFT JOIN users u ON u.id = t.assigned_to
        ORDER BY t.created_at DESC
        LIMIT 500
        `
      )
    : await pool.query(
        `
        SELECT t.*, u.name as assignee_name
        FROM tasks t
        LEFT JOIN users u ON u.id = t.assigned_to
        WHERE t.assigned_to = $1
        ORDER BY t.created_at DESC
        LIMIT 500
        `,
        [req.user.sub]
      );
  return res.json({ items: out.rows });
});

tasksRouter.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const v = validate(taskCreateSchema, req.body ?? {});
  if (!v.ok) return res.status(400).json(v);
  const { title, department, assigned_to, frequency } = v.value;

  const out = await pool.query(
    `
    INSERT INTO tasks (title, department, assigned_to, frequency, status)
    VALUES ($1,$2,$3,$4,'pending')
    RETURNING *
    `,
    [title, department, assigned_to ?? null, frequency]
  );
  return res.status(201).json(out.rows[0]);
});

tasksRouter.patch("/:id", requireAuth, requireRole("admin", "staff"), async (req, res) => {
  const v = validate(taskPatchSchema, req.body ?? {});
  if (!v.ok) return res.status(400).json(v);
  const { id } = req.params;
  const { status, assigned_to } = v.value;

  const current = await pool.query(`SELECT * FROM tasks WHERE id=$1`, [id]);
  const task = current.rows[0];
  if (!task) return res.status(404).json({ error: "not_found" });

  const isAdmin = req.user.role === "admin";
  const isAssignee = task.assigned_to && task.assigned_to === req.user.sub;
  if (!isAdmin && !isAssignee) return res.status(403).json({ error: "forbidden" });

  const out = await pool.query(
    `
    UPDATE tasks
    SET status = COALESCE($2,status),
        assigned_to = COALESCE($3,assigned_to),
        updated_at = now()
    WHERE id=$1
    RETURNING *
    `,
    [id, status ?? null, isAdmin ? (assigned_to ?? null) : null]
  );
  return res.json(out.rows[0]);
});

