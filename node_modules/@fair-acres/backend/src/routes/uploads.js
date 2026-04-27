import express from "express";
import { putObject } from "../storage/s3.js";

export const uploadsRouter = express.Router();

function parseDataUrl(dataUrl) {
  const m = /^data:(image\/png|image\/jpeg);base64,(.+)$/.exec(dataUrl ?? "");
  if (!m) return null;
  const contentType = m[1];
  const body = Buffer.from(m[2], "base64");
  return { contentType, body };
}

// Public: used by guest form before complaint submit.
// Body: { files: [{ data_url, content_type? }] }  (frontend sends compressed data URLs)
uploadsRouter.post("/", async (req, res) => {
  const files = Array.isArray(req.body?.files) ? req.body.files.slice(0, 3) : [];
  if (files.length === 0) return res.status(400).json({ error: "no_files" });

  const uploaded = [];
  for (const f of files) {
    const parsed = parseDataUrl(f.data_url);
    if (!parsed) return res.status(400).json({ error: "invalid_file" });
    if (!["image/png", "image/jpeg"].includes(parsed.contentType)) {
      return res.status(400).json({ error: "unsupported_type" });
    }
    if (parsed.body.length > 5 * 1024 * 1024) return res.status(400).json({ error: "file_too_large" });
    const obj = await putObject({ contentType: parsed.contentType, body: parsed.body, prefix: "guest-complaints" });
    uploaded.push({ url: obj.url, key: obj.key });
  }

  return res.json({ items: uploaded });
});

