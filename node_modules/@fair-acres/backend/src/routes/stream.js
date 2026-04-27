import express from "express";
import { verifyAccessToken } from "../auth/jwt.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { subscribe } from "../notifications/bus.js";

export const streamRouter = express.Router();

function authFromQuery(req, res, next) {
  const token = req.query?.token;
  if (!token || typeof token !== "string") return res.status(401).json({ error: "unauthorized" });
  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
}

// SSE: Admin/Staff can subscribe for real-time events.
streamRouter.get(
  "/events",
  // EventSource can't set Authorization headers; allow token via query string.
  (req, res, next) => (req.headers.authorization ? requireAuth(req, res, next) : authFromQuery(req, res, next)),
  requireRole("staff", "admin"),
  (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (event) => {
    res.write(`event: ${event.type}\n`);
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  send({ type: "connected", role: req.user.role, ts: Date.now() });

  const unsub = subscribe(send);

  const ping = setInterval(() => {
    res.write(`event: ping\n`);
    res.write(`data: ${Date.now()}\n\n`);
  }, 25_000);

  req.on("close", () => {
    clearInterval(ping);
    unsub();
  });
  }
);

