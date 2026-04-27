import express from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool.js";
import { signAccessToken } from "../auth/jwt.js";
import { loginSchema } from "../validation/schemas.js";
import { validate } from "../utils/validate.js";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  const v = validate(loginSchema, req.body ?? {});
  if (!v.ok) return res.status(400).json(v);
  const { email, phone, password, pin } = v.value;

  const q = email
    ? { text: "SELECT id, name, role, email, phone, password_hash FROM users WHERE lower(email)=lower($1) LIMIT 1", values: [email] }
    : { text: "SELECT id, name, role, email, phone, password_hash FROM users WHERE phone=$1 LIMIT 1", values: [phone] };

  const userRes = await pool.query(q);
  const u = userRes.rows[0];
  if (!u) return res.status(401).json({ error: "invalid_credentials" });

  const secret = email ? password : pin;
  const ok = await bcrypt.compare(secret, u.password_hash);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });

  const token = signAccessToken({ sub: u.id, role: u.role, name: u.name });
  return res.json({
    access_token: token,
    user: { id: u.id, name: u.name, role: u.role, email: u.email, phone: u.phone }
  });
});

