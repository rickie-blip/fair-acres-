import { pool } from "./pool.js";
import { config } from "../config.js";

const sql = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('staff','admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complaint_category') THEN
    CREATE TYPE complaint_category AS ENUM ('cleaning','bathroom','smell','service','other');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complaint_urgency') THEN
    CREATE TYPE complaint_urgency AS ENUM ('normal','urgent');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'complaint_status') THEN
    CREATE TYPE complaint_status AS ENUM ('new','in_progress','resolved');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
    CREATE TYPE task_status AS ENUM ('pending','completed');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  role user_role NOT NULL,
  phone text,
  email text,
  password text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_phone_or_email_chk CHECK (phone IS NOT NULL OR email IS NOT NULL)
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_uq ON users (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS users_phone_uq ON users (phone) WHERE phone IS NOT NULL;

CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_number text,
  category complaint_category NOT NULL,
  description text NOT NULL,
  urgency complaint_urgency NOT NULL,
  status complaint_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS complaint_images (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id uuid NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  image_url text NOT NULL
);
CREATE INDEX IF NOT EXISTS complaint_images_complaint_id_idx ON complaint_images (complaint_id);

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  department text NOT NULL,
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  frequency text NOT NULL,
  status task_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tasks_assigned_to_idx ON tasks (assigned_to);

CREATE TABLE IF NOT EXISTS task_evidence (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS task_evidence_task_id_idx ON task_evidence (task_id);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL,
  severity text NOT NULL DEFAULT 'info',
  message text NOT NULL,
  complaint_id uuid REFERENCES complaints(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  acknowledged_at timestamptz
);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications (created_at DESC);
`;

async function main() {
  if (config.useJsonDb) {
    await pool.query("SELECT id, name, role, email, phone, password FROM users WHERE lower(email)=lower($1) LIMIT 1", ["admin@fairacres.local"]);
    await pool.end();
    console.log(`JSON DB ready at ${config.jsonDbPath}`);
    return;
  }
  await pool.query(sql);
  await pool.end();
  console.log("Migrations applied.");
}

main().catch(async (err) => {
  console.error(err);
  try { await pool.end(); } catch {}
  process.exit(1);
});
