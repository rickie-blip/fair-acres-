import { pool } from "../db/pool.js";
import { config } from "../config.js";
import { publish } from "../notifications/bus.js";

export function startEscalationJob() {
  const everyMs = 60_000;
  setInterval(async () => {
    const mins = config.escalation.escalateNewAfterMinutes;
    const out = await pool.query(
      `
      SELECT id, room_number, created_at
      FROM complaints
      WHERE status='new'
        AND created_at < now() - ($1::text || ' minutes')::interval
      ORDER BY created_at ASC
      LIMIT 20
      `,
      [String(mins)]
    );

    for (const c of out.rows) {
      await pool.query(
        `INSERT INTO notifications (type, severity, message, complaint_id) VALUES ($1,$2,$3,$4)`,
        [
          "complaint_escalated",
          "warning",
          `Complaint pending > ${mins} min${c.room_number ? ` (room ${c.room_number})` : ""}`,
          c.id
        ]
      );
      publish({ type: "complaint_escalated", complaint_id: c.id, threshold_minutes: mins });
    }
  }, everyMs);
}

