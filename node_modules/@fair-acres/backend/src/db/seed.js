import { pool } from "./pool.js";
import { config } from "../config.js";

async function upsertUser({ name, role, email, phone, password }) {
  const res = await pool.query(
    `
    INSERT INTO users (name, role, email, phone, password)
    VALUES ($1,$2,$3,$4,$5)
    ON CONFLICT ((lower(email))) WHERE $3 IS NOT NULL
    DO UPDATE SET name=EXCLUDED.name, role=EXCLUDED.role, phone=EXCLUDED.phone, password=EXCLUDED.password
    RETURNING id
    `,
    [name, role, email ?? null, phone ?? null, password]
  );
  return res.rows[0].id;
}

async function main() {
  if (config.useJsonDb) {
    await pool.query("SELECT id, name, role, email, phone, password FROM users WHERE lower(email)=lower($1) LIMIT 1", ["admin@fairacres.local"]);
    await pool.end();
    console.log(`JSON seed ready at ${config.jsonDbPath}`);
    console.log("Admin login: admin@fairacres.local / Admin123!");
    console.log("Manager login: manager@fairacres.local / Manager123!");
    console.log("Staff login: staff@fairacres.local / Staff123!");
    return;
  }

  const adminId = await upsertUser({
    name: "Fair Acres Admin",
    role: "admin",
    email: "admin@fairacres.local",
    password: "Admin123!"
  });

  await upsertUser({
    name: "Fair Acres Manager",
    role: "admin",
    email: "manager@fairacres.local",
    password: "Manager123!"
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
  console.log("Manager login: manager@fairacres.local / Manager123!");
  console.log("Staff login: staff@fairacres.local / Staff123!");
}

main().catch(async (err) => {
  console.error(err);
  try { await pool.end(); } catch {}
  process.exit(1);
});
