import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config.js";

const defaultData = {
  users: [
    {
      id: "11111111-1111-4111-8111-111111111111",
      name: "Fair Acres Admin",
      role: "admin",
      email: "admin@fairacres.local",
      phone: null,
      password: "Admin123!",
      created_at: "2026-01-01T08:00:00.000Z"
    },
    {
      id: "12121212-1212-4212-8212-121212121212",
      name: "Fair Acres Manager",
      role: "admin",
      email: "manager@fairacres.local",
      phone: null,
      password: "Manager123!",
      created_at: "2026-01-01T08:03:00.000Z"
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      name: "Fair Acres Staff",
      role: "staff",
      email: "staff@fairacres.local",
      phone: null,
      password: "Staff123!",
      created_at: "2026-01-01T08:05:00.000Z"
    }
  ],
  complaints: [],
  complaint_images: [],
  tasks: [
    {
      id: "33333333-3333-4333-8333-333333333333",
      title: "Lobby quick tidy",
      department: "Housekeeping",
      assigned_to: "22222222-2222-4222-8222-222222222222",
      frequency: "30min",
      status: "pending",
      created_at: "2026-01-01T09:00:00.000Z",
      updated_at: "2026-01-01T09:00:00.000Z"
    },
    {
      id: "44444444-4444-4444-8444-444444444444",
      title: "Pool chemical check",
      department: "Maintenance",
      assigned_to: "22222222-2222-4222-8222-222222222222",
      frequency: "daily",
      status: "pending",
      created_at: "2026-01-01T09:10:00.000Z",
      updated_at: "2026-01-01T09:10:00.000Z"
    }
  ],
  task_evidence: [],
  notifications: []
};

function cloneDefaultData() {
  return JSON.parse(JSON.stringify(defaultData));
}

async function ensureStore() {
  try {
    const raw = await readFile(config.jsonDbPath, "utf8");
    const parsed = JSON.parse(raw);
    return {
      ...cloneDefaultData(),
      ...parsed,
      users: Array.isArray(parsed.users) ? parsed.users : cloneDefaultData().users,
      complaints: Array.isArray(parsed.complaints) ? parsed.complaints : [],
      complaint_images: Array.isArray(parsed.complaint_images) ? parsed.complaint_images : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : cloneDefaultData().tasks,
      task_evidence: Array.isArray(parsed.task_evidence) ? parsed.task_evidence : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : []
    };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    const initial = cloneDefaultData();
    await mkdir(dirname(config.jsonDbPath), { recursive: true });
    await writeFile(config.jsonDbPath, `${JSON.stringify(initial, null, 2)}\n`, "utf8");
    return initial;
  }
}

async function saveStore(store) {
  await mkdir(dirname(config.jsonDbPath), { recursive: true });
  await writeFile(config.jsonDbPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

function nowIso() {
  return new Date().toISOString();
}

function sortByCreatedDesc(items) {
  return [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function addComplaintImages(complaint, store) {
  const images = store.complaint_images
    .filter((image) => image.complaint_id === complaint.id)
    .map((image) => image.image_url);
  return { ...complaint, images };
}

function addAssigneeName(task, store) {
  const assignee = store.users.find((user) => user.id === task.assigned_to);
  return { ...task, assignee_name: assignee?.name ?? null };
}

function toQueryParts(input, values) {
  if (typeof input === "string") return { text: input, values: values ?? [] };
  return { text: input.text, values: input.values ?? [] };
}

class JsonPool {
  #pending = Promise.resolve();

  async query(input, values) {
    const job = async () => {
      const { text, values: queryValues } = toQueryParts(input, values);
      const sql = text.replace(/\s+/g, " ").trim();
      const store = await ensureStore();

      if (sql.startsWith("INSERT INTO complaints ")) {
        const timestamp = nowIso();
        const complaint = {
          id: uuidv4(),
          room_number: queryValues[0],
          category: queryValues[1],
          description: queryValues[2],
          urgency: queryValues[3],
          status: "new",
          created_at: timestamp,
          updated_at: timestamp
        };
        store.complaints.push(complaint);
        await saveStore(store);
        return {
          rows: [
            {
              id: complaint.id,
              room_number: complaint.room_number,
              category: complaint.category,
              description: complaint.description,
              urgency: complaint.urgency,
              status: complaint.status,
              created_at: complaint.created_at,
              updated_at: complaint.updated_at
            }
          ]
        };
      }

      if (sql.startsWith("INSERT INTO complaint_images ")) {
        store.complaint_images.push({
          id: uuidv4(),
          complaint_id: queryValues[0],
          image_url: queryValues[1]
        });
        await saveStore(store);
        return { rows: [] };
      }

      if (sql.startsWith("INSERT INTO notifications ")) {
        store.notifications.push({
          id: uuidv4(),
          type: queryValues[0],
          severity: queryValues[1],
          message: queryValues[2],
          complaint_id: queryValues[3] ?? null,
          created_at: nowIso(),
          acknowledged_at: null
        });
        await saveStore(store);
        return { rows: [] };
      }

      if (sql.includes("FROM complaints c LEFT JOIN complaint_images")) {
        if (sql.includes("WHERE c.id=$1")) {
          const complaint = store.complaints.find((item) => item.id === queryValues[0]);
          return { rows: complaint ? [addComplaintImages(complaint, store)] : [] };
        }
        return {
          rows: sortByCreatedDesc(store.complaints)
            .slice(0, 200)
            .map((complaint) => addComplaintImages(complaint, store))
        };
      }

      if (sql.startsWith("UPDATE complaints SET status=$2, updated_at=now() WHERE id=$1 RETURNING *")) {
        const complaint = store.complaints.find((item) => item.id === queryValues[0]);
        if (!complaint) return { rows: [] };
        complaint.status = queryValues[1];
        complaint.updated_at = nowIso();
        await saveStore(store);
        return { rows: [{ ...complaint }] };
      }

      if (sql.startsWith("SELECT t.*, u.name as assignee_name FROM tasks t LEFT JOIN users u ON u.id = t.assigned_to WHERE t.assigned_to = $1")) {
        return {
          rows: sortByCreatedDesc(store.tasks)
            .filter((task) => task.assigned_to === queryValues[0])
            .slice(0, 500)
            .map((task) => addAssigneeName(task, store))
        };
      }

      if (sql.startsWith("SELECT t.*, u.name as assignee_name FROM tasks t LEFT JOIN users u ON u.id = t.assigned_to ORDER BY t.created_at DESC LIMIT 500")) {
        return {
          rows: sortByCreatedDesc(store.tasks)
            .slice(0, 500)
            .map((task) => addAssigneeName(task, store))
        };
      }

      if (sql.startsWith("INSERT INTO tasks ")) {
        const timestamp = nowIso();
        const task = {
          id: uuidv4(),
          title: queryValues[0],
          department: queryValues[1],
          assigned_to: queryValues[2] ?? null,
          frequency: queryValues[3],
          status: "pending",
          created_at: timestamp,
          updated_at: timestamp
        };
        store.tasks.push(task);
        await saveStore(store);
        return { rows: [{ ...task }] };
      }

      if (sql === "SELECT * FROM tasks WHERE id=$1") {
        const task = store.tasks.find((item) => item.id === queryValues[0]);
        return { rows: task ? [{ ...task }] : [] };
      }

      if (sql.startsWith("UPDATE tasks SET status = COALESCE($2,status), assigned_to = COALESCE($3,assigned_to), updated_at = now() WHERE id=$1 RETURNING *")) {
        const task = store.tasks.find((item) => item.id === queryValues[0]);
        if (!task) return { rows: [] };
        if (queryValues[1] !== null && queryValues[1] !== undefined) task.status = queryValues[1];
        if (queryValues[2] !== null && queryValues[2] !== undefined) task.assigned_to = queryValues[2];
        task.updated_at = nowIso();
        await saveStore(store);
        return { rows: [{ ...task }] };
      }

      if (sql.startsWith("INSERT INTO task_evidence ")) {
        const evidence = {
          id: uuidv4(),
          task_id: queryValues[0],
          file_url: queryValues[1],
          submitted_at: nowIso()
        };
        store.task_evidence.push(evidence);
        await saveStore(store);
        return { rows: [{ ...evidence }] };
      }

      if (sql.startsWith("SELECT id, name, role, email, phone, password FROM users WHERE lower(email)=lower($1) LIMIT 1")) {
        const email = String(queryValues[0] ?? "").toLowerCase();
        const user = store.users.find((item) => String(item.email ?? "").toLowerCase() === email);
        return { rows: user ? [{ ...user }] : [] };
      }

      if (sql.startsWith("SELECT id, name, role, email, phone, password FROM users WHERE phone=$1 LIMIT 1")) {
        const user = store.users.find((item) => item.phone === queryValues[0]);
        return { rows: user ? [{ ...user }] : [] };
      }

      if (sql.startsWith("SELECT id, room_number, created_at FROM complaints WHERE status='new'")) {
        const mins = Number(queryValues[0] ?? 0);
        const threshold = Date.now() - mins * 60_000;
        return {
          rows: store.complaints
            .filter((complaint) => complaint.status === "new" && new Date(complaint.created_at).getTime() < threshold)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            .slice(0, 20)
            .map(({ id, room_number, created_at }) => ({ id, room_number, created_at }))
        };
      }

      throw new Error(`Unsupported JSON DB query: ${sql}`);
    };

    const next = this.#pending.then(job, job);
    this.#pending = next.catch(() => {});
    return next;
  }

  async end() {}
}

export const jsonPool = new JsonPool();
