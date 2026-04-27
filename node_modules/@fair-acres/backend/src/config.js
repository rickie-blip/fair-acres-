import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: required("DATABASE_URL"),
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

