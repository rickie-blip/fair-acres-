# Fair Acres – Hotel Operations (RBAC)

## What you get

- **Guest (no login)**: QR-style complaint form (`/?room=402`)
- **Staff (JWT login)**: view assigned tasks, mark complete
- **Admin (JWT login)**: live complaint feed (SSE), update status, create tasks
- **Postgres**: complaints/tasks/users + images/evidence + notifications
- **Cloud storage (dev)**: S3-compatible **MinIO** via Docker Compose

## Local setup (Windows)

1) Create a `.env` file at repo root (copy from `.env.example`).

2) Start Postgres + MinIO:

```bash
docker compose up -d
```

3) Create the MinIO bucket (one-time)

- Open MinIO console at `http://localhost:9001`
- Login: `minioadmin` / `minioadmin`
- Create bucket named `fair-acres`

4) Install deps:

```bash
npm install
```

5) Run migrations + seed:

```bash
npm run migrate -w backend
npm run seed -w backend
```

6) Run the app:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`

## Use it

- **Guest complaint form**: `http://localhost:5173/?room=402`
- **Login**: `http://localhost:5173/login`
  - Admin: `admin@fairacres.local` / `Admin123!`
  - Staff: `staff@fairacres.local` / `Staff123!`

## Notes

- **RBAC** is enforced on backend routes using JWT role claims.
- **Guest** can only hit `POST /api/uploads` and `POST /api/complaints`.
- **Escalation**: `ESCALATE_NEW_AFTER_MINUTES` triggers a notification event when a complaint stays `new` too long.

