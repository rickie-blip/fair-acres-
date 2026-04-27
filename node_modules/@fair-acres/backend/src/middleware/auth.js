import { verifyAccessToken } from "../auth/jwt.js";

export function requireAuth(req, res, next) {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer ")) return res.status(401).json({ error: "unauthorized" });
  const token = hdr.slice("Bearer ".length);
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "forbidden" });
    return next();
  };
}

