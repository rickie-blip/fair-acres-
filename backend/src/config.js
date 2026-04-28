import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envCandidates = [
  resolve(__dirname, "../../.env"),
  resolve(__dirname, "../.env")
];

for (const envPath of envCandidates) {
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  useJsonDb: String(process.env.USE_JSON_DB ?? "false").toLowerCase() === "true",
  databaseUrl:
    String(process.env.USE_JSON_DB ?? "false").toLowerCase() === "true"
      ? process.env.DATABASE_URL ?? "json://local"
      : required("DATABASE_URL"),
  jsonDbPath: process.env.JSON_DB_PATH ?? resolve(__dirname, "../data/mock-db.json"),
  jwtSecret: required("JWT_SECRET"),
  escalation: {
    escalateNewAfterMinutes: Number(process.env.ESCALATE_NEW_AFTER_MINUTES ?? 15)
  },
  s3: {
    region: process.env.S3_REGION ?? "us-east-1",
    bucket: required("S3_BUCKET"),
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: required("S3_ACCESS_KEY_ID"),
    secretAccessKey: required("S3_SECRET_ACCESS_KEY"),
    forcePathStyle: String(process.env.S3_FORCE_PATH_STYLE ?? "false").toLowerCase() === "true"
  }
};
