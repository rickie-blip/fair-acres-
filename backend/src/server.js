import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "./config.js";
import { authRouter } from "./routes/auth.js";
import { complaintsRouter } from "./routes/complaints.js";
import { tasksRouter } from "./routes/tasks.js";
import { taskEvidenceRouter } from "./routes/taskEvidence.js";
import { uploadsRouter } from "./routes/uploads.js";
import { streamRouter } from "./routes/stream.js";
import { startEscalationJob } from "./escalation/job.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "8mb" })); // supports base64 image data URLs
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/complaints", complaintsRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/tasks", taskEvidenceRouter);
app.use("/api/stream", streamRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ error: "internal_error" });
});

app.listen(config.port, () => {
  console.log(`Backend listening on http://localhost:${config.port}`);
});

startEscalationJob();

