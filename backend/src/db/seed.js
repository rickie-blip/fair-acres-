import bcrypt from "bcryptjs";
import { pool } from "./pool.js";

async function upsertUser({ name, role, email, phone, password }) {
  const passwordHash = await bcrypt.hash(password, 12);
  const res = await pool.query(
    `
    INSERT INTO users (name, role, email, phone, password_hash)
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT ((lower(email))) WHERE $3 IS NOT NULL
    DO UPDATE SET name=EXCLUDED.name, role=EXCLUDED.role, phone=EXCLUDED.phone, password_hash=EXCLUDED.password_hash
    RETURNING id
    `,
    [name, role, email ?? null, phone ?? null, passwordHash]
  );
  return res.rows[0].id;
}

async function main() {
  const adminId = await upsertUser({
    name: "Fair Acres Admin",
    role: "admin",
    email: "admin@fairacres.local",
    password: "Admin123!"
  });

  const staffId = await upsertUser({
    name: "Fair Acres Staff",
    role: "staff",
    email: "staff@fairacres.local",
    password: "Staff123!"
  });

  await pool.query(
    `
    INSERT INTO tasks (title, department, assigned_to, frequency, status)
    VALUES
      ('Lobby quick tidy', 'Housekeeping', $1, '30min', 'pending'),
      ('Pool chemical check', 'Maintenance', $1, 'daily', 'pending')
    ON CONFLICT DO NOTHING
    `,
    [staffId]
  );

  await pool.end();
  console.log("Seed complete.");
  console.log("Admin login: admin@fairacres.local / Admin123!");
  console.log("Staff login: staff@fairacres.local / Staff123!");
}

main().catch(async (err) => {
  console.error(err);
  try { await pool.end(); } catch {}
  process.exit(1);
});

