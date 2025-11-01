import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION as string,
  endpoint: process.env.NEXT_PUBLIC_S3_URL as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY as string,
  },
  forcePathStyle: true,
  tls: true,
  requestHandler: {
    requestTimeout: 30000,
  },
});
