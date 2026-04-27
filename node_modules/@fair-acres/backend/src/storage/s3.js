import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config.js";

export const s3 = new S3Client({
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  forcePathStyle: config.s3.forcePathStyle,
  credentials: {
    accessKeyId: config.s3.accessKeyId,
    secretAccessKey: config.s3.secretAccessKey
  }
});

export function publicObjectUrl(key) {
  if (!config.s3.endpoint) return `s3://${config.s3.bucket}/${key}`;
  const base = config.s3.forcePathStyle
    ? `${config.s3.endpoint.replace(/\/$/, "")}/${config.s3.bucket}`
    : `${config.s3.bucket}.${config.s3.endpoint.replace(/\/$/, "").replace(/^https?:\/\//, "")}`;
  return `${config.s3.endpoint.replace(/\/$/, "")}/${config.s3.bucket}/${encodeURIComponent(key)}`;
}

export async function putObject({ contentType, body, prefix }) {
  const ext = contentType === "image/png" ? "png" : contentType === "image/jpeg" ? "jpg" : "bin";
  const key = `${prefix}/${uuidv4()}.${ext}`;
  await s3.send(
    new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      Body: body,
      ContentType: contentType
    })
  );
  return { key, url: publicObjectUrl(key) };
}

