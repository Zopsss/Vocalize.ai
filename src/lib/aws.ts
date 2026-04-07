import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { env } from "@/env";

const globalForS3Client = global as unknown as {
  s3Client: S3Client;
};

const s3Client =
  globalForS3Client.s3Client ||
  new S3Client({
    region: env.S3_BUCKET_REGION,
    credentials: {
      accessKeyId: env.S3_BUCKET_ACCESS_KEY,
      secretAccessKey: env.S3_BUCKET_SECRET_ACCESS_KEY,
    },
  });

if (env.NODE_ENV !== "production") globalForS3Client.s3Client = s3Client;

export const createPresignedUrlWithClient = (
  key: string,
  contentType: string
) => {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export const createPresignedDownloadUrl = (key: string, fileName: string) => {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${fileName}"`,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 min
};

export const deleteS3Object = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });

  return await s3Client.send(command);
};

export const uploadToS3 = async (
  key: string,
  body: Buffer,
  contentType: string
) => {
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  return await s3Client.send(command);
};

export const createPresignedStreamUrl = (key: string) => {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export async function getS3ObjectBuffer(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET_NAME!,
    Key: key,
  });

  const response = await s3Client.send(command);
  const stream = response.Body as NodeJS.ReadableStream;

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}
