# S3 Object Storage Integratsiyasi

## Umumiy Ko'rinish

Elektro Mart loyihasida Contabo S3 Object Storage to'liq integratsiya qilingan. Bu rasmlarni saqlash, yuklash va boshqarish uchun ishlatiladi.

## O'rnatilgan Paketlar

```bash
npm install @aws-sdk/client-s3
```

## Fayl Tuzilmasi

```
lib/s3/
├── s3-client.ts          # S3 client konfiguratsiyasi
├── upload.ts             # Rasmlarni yuklash
├── list.ts               # Rasmlar ro'yxatini olish
└── delete.ts             # Rasmlarni o'chirish
```

## Konfiguratsiya

### 1. Environment Variables

`.env.local` faylida quyidagi o'zgaruvchilarni sozlang:

```env
# S3 Object Storage Configuration (Contabo)
NEXT_PUBLIC_S3_REGION=us-east-1
NEXT_PUBLIC_S3_URL=https://your-contabo-endpoint.com
NEXT_PUBLIC_S3_BUCKET=elektromart
NEXT_PUBLIC_S3_ACCESS_KEY_ID=your-access-key-id
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=your-secret-access-key
```

### 2. S3 Client (`lib/s3/s3-client.ts`)

```typescript
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION as string,
  endpoint: process.env.NEXT_PUBLIC_S3_URL as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY as string,
  },
  forcePathStyle: true,
});
```

## API Funksiyalari

### 1. Upload - Rasm Yuklash

**Fayl:** `lib/s3/upload.ts`

```typescript
import { uploadToObjectStorage } from "@/lib/s3/upload";

// Foydalanish
const file = event.target.files[0];
const arrayBuffer = await file.arrayBuffer();
const uint8Array = new Uint8Array(arrayBuffer);
const key = `images/${Date.now()}-${file.name}`;

await uploadToObjectStorage(
  "elektromart",      // bucket
  key,                // key
  uint8Array,         // body
  file.type           // contentType
);
```

**Parametrlar:**
- `bucket` (string) - Bucket nomi
- `key` (string) - Fayl yo'li (masalan: "images/photo.jpg")
- `body` (Uint8Array) - Fayl ma'lumotlari
- `contentType` (string) - MIME type (masalan: "image/jpeg")

**Qaytaradi:** `Promise<string>` - Yuklangan fayl key'i

### 2. List - Rasmlar Ro'yxati

**Fayl:** `lib/s3/list.ts`

```typescript
import { listObjectsFromS3 } from "@/lib/s3/list";

// Foydalanish
const result = await listObjectsFromS3(
  "elektromart",      // bucket
  "images/",          // prefix
  undefined,          // continuationToken
  100                 // maxKeys
);

console.log(result.objects);
```

**Parametrlar:**
- `bucket` (string) - Bucket nomi
- `prefix` (string) - Papka prefixi (masalan: "images/")
- `continuationToken` (string, optional) - Pagination uchun
- `maxKeys` (number) - Maksimal natijalar soni

**Qaytaradi:**
```typescript
{
  objects: S3ObjectInfo[],
  isTruncated: boolean,
  nextContinuationToken?: string
}
```

**S3ObjectInfo:**
```typescript
{
  key: string;              // Fayl yo'li
  size: number;             // Hajmi (bytes)
  lastModified: string;     // Oxirgi o'zgarish vaqti
  type: "image" | "video" | "other";
}
```

### 3. Delete - Rasmni O'chirish

**Fayl:** `lib/s3/delete.ts`

```typescript
import { deleteFromObjectStorage } from "@/lib/s3/delete";

// Foydalanish
await deleteFromObjectStorage(
  "elektromart",              // bucket
  "images/photo.jpg"          // key
);
```

**Parametrlar:**
- `bucket` (string) - Bucket nomi
- `key` (string) - Fayl yo'li

**Qaytaradi:** `Promise<boolean>` - Muvaffaqiyatli o'chirildi

## Gallery Sahifasi

Admin panelda `/admin/gallery` sahifasi S3 bilan to'liq integratsiya qilingan.

### Xususiyatlar:

1. **Rasmlarni Ko'rish**
   - S3 dan barcha rasmlar yuklanadi
   - Grid layout (responsive)
   - Fayl nomi va hajmi ko'rsatiladi

2. **Qidirish**
   - Real-time qidirish
   - Fayl nomi bo'yicha

3. **Yuklash**
   - Modal orqali
   - Bir yoki bir nechta rasmlar
   - Drag & drop (kelajakda)

4. **O'chirish**
   - Bitta yoki bir nechta rasmlar
   - Tasdiqlash bilan

5. **Tanlash**
   - Checkbox orqali
   - "Barchasini tanlash" funksiyasi

### Kod Misoli:

```typescript
// Rasmlarni yuklash
const handleUpload = async () => {
  for (const file of uploadFiles) {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const key = `images/${Date.now()}-${file.name}`;
    
    await uploadToObjectStorage(
      BUCKET_NAME,
      key,
      uint8Array,
      file.type
    );
  }
  
  loadImages(); // Ro'yxatni yangilash
};

// Rasmlarni o'chirish
const handleDelete = async (keys: string[]) => {
  for (const key of keys) {
    await deleteFromObjectStorage(BUCKET_NAME, key);
  }
  
  loadImages(); // Ro'yxatni yangilash
};
```

## Rasm URL Formati

S3 dan rasmlarni ko'rsatish uchun:

```typescript
const getImageUrl = (key: string) => {
  return `${S3_BASE_URL}/${BUCKET_NAME}/${key}`;
};

// Misol:
// https://your-contabo-endpoint.com/elektromart/images/1730467200000-photo.jpg
```

## Next.js Image Konfiguratsiyasi

`next.config.ts` faylida:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
};
```

## CORS Sozlamalari

S3 bucket'da CORS sozlamalarini qo'shing:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

## Bucket Permissions

Bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::elektromart/*"
    }
  ]
}
```

## Xavfsizlik

### Best Practices:

1. **Environment Variables**
   - Hech qachon credentials'larni kodga qo'shmang
   - `.env.local` faylidan foydalaning
   - `.env.local` faylini `.gitignore` ga qo'shing

2. **Access Control**
   - Minimal kerakli permissions bering
   - IAM user yarating faqat S3 uchun
   - Access key'larni muntazam yangilang

3. **HTTPS**
   - Har doim HTTPS ishlatiladi
   - HTTP faqat development uchun

4. **Validation**
   - Fayl hajmini tekshiring (max 10MB)
   - Fayl formatini tekshiring
   - Fayl nomini sanitize qiling

## Xatoliklarni Bartaraf Etish

### 1. Connection Error
```
Error: connect ECONNREFUSED
```
**Yechim:** S3 endpoint URL to'g'riligini tekshiring

### 2. Access Denied
```
Error: Access Denied
```
**Yechim:** 
- Credentials to'g'riligini tekshiring
- Bucket permissions'larni tekshiring
- IAM policy'ni tekshiring

### 3. CORS Error
```
Error: CORS policy
```
**Yechim:** S3 bucket CORS sozlamalarini qo'shing

### 4. Invalid Bucket Name
```
Error: The specified bucket is not valid
```
**Yechim:** Bucket nomi to'g'riligini tekshiring

## Monitoring va Logging

Console log'lar:

```typescript
// Upload
console.log("✅ Upload successful!");

// Delete
console.log("🗑️ Delete successful!");

// List
console.log("List error:", error);
```

Browser console'da barcha operatsiyalar log qilinadi.

## Kelajakdagi Yaxshilanishlar

- [ ] Multipart upload (katta fayllar uchun)
- [ ] Progress bar yuklashda
- [ ] Image optimization (resize, compress)
- [ ] CDN integratsiyasi
- [ ] Backup va versioning
- [ ] Analytics va usage tracking
- [ ] Automatic cleanup (eski fayllarni o'chirish)

## Qo'shimcha Resurslar

- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [S3 Client Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Contabo Object Storage](https://contabo.com/en/object-storage/)

## Yordam

Muammo yuzaga kelsa:
1. Browser console'ni tekshiring
2. Network tab'da API so'rovlarni ko'ring
3. `.env.local` sozlamalarni tekshiring
4. S3 bucket permissions'larni tekshiring
5. CORS sozlamalarni tekshiring
