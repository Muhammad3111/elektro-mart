# Contabo S3 Configuration

## Environment Variables

Add these to your `.env.development` and `.env.production` files:

```env
# Contabo S3 Configuration
NEXT_PUBLIC_S3_URL=https://eu2.contabostorage.com
NEXT_PUBLIC_S3_BUCKET_NAME=wwts
NEXT_PUBLIC_S3_REGION=eu-2
NEXT_PUBLIC_S3_URL_IMAGE=https://eu2.contabostorage.com/wwts

# Server-side only (DO NOT prefix with NEXT_PUBLIC_)
S3_URL=https://eu2.contabostorage.com
S3_BUCKET_NAME=wwts
S3_REGION=eu-2
S3_ACCESS_KEY_ID=your_access_key_here
S3_SECRET_ACCESS_KEY=your_secret_key_here
S3_PUBLIC_URL=https://eu2.contabostorage.com/wwts
```

## Important Notes

1. The bucket name is `wwts`
2. The endpoint URL is `https://eu2.contabostorage.com`
3. Region is `eu-2`
4. Make sure to set proper CORS configuration on your Contabo bucket
5. Ensure bucket has public read access for images

## CORS Configuration

Add this CORS configuration to your Contabo bucket:

```json
[
    {
        "AllowedOrigins": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedHeaders": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

## Bucket Policy (Public Read)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::wwts/*"
        }
    ]
}
```
