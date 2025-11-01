# Gallery Sahifasi - Foydalanish Qo'llanmasi

## Umumiy Ma'lumot

Admin panelda `/admin/gallery` sahifasi Contabo S3 Object Storage bilan to'liq integratsiya qilingan. Bu sahifa orqali rasmlarni yuklash, ko'rish, qidirish va o'chirish mumkin.

## Xususiyatlar

### 1. Rasmlarni Ko'rish
- S3 bucket'dan barcha rasmlar avtomatik yuklanadi
- Har bir rasm uchun:
  - Rasm preview
  - Fayl nomi
  - Fayl hajmi (KB, MB formatida)
- Grid layout (responsive: 2-5 ustunlar)

### 2. Qidirish
- Tepada search input mavjud
- Rasm nomi bo'yicha real-time qidirish
- Qidiruv natijasi darhol ko'rsatiladi

### 3. Rasmlarni Tanlash
- **Bitta rasm**: Rasmga bosish orqali
- **Bir nechta rasm**: Har bir rasmni alohida tanlash
- **Barcha rasmlar**: "Barchasini tanlash" checkbox orqali
- Tanlangan rasmlar ko'k border bilan ajratiladi

### 4. Rasmlarni Yuklash
- **"Rasm yuklash"** tugmasini bosing
- Modal oynasi ochiladi
- **Fayllarni tanlash**:
  - "Fayllarni tanlash" tugmasini bosing
  - Bir yoki bir nechta rasmlarni tanlang
  - Qo'llab-quvvatlanadigan formatlar: PNG, JPG, GIF, WEBP, AVIF, SVG
- **Tanlangan fayllar**:
  - Har bir fayl nomi va hajmi ko'rsatiladi
  - X tugmasi orqali faylni olib tashlash mumkin
- **"Yuklash"** tugmasini bosing
- Rasmlar S3 ga `images/` papkasiga yuklanadi
- Yuklash jarayonida loading ko'rsatiladi
- Muvaffaqiyatli yuklangandan keyin modal yopiladi va rasmlar ro'yxati yangilanadi

### 5. Rasmlarni O'chirish

#### Bitta rasmni o'chirish:
1. Rasmning ustiga hover qiling
2. Trash (o'chirish) tugmasi paydo bo'ladi
3. Tugmani bosing
4. Tasdiqlash oynasi ochiladi
5. Tasdiqlang

#### Bir nechta rasmni o'chirish:
1. O'chirmoqchi bo'lgan rasmlarni tanlang
2. Tepada "X ta o'chirish" tugmasi paydo bo'ladi
3. Tugmani bosing
4. Tasdiqlash oynasi ochiladi
5. Tasdiqlang

## Texnik Tafsilotlar

### S3 Konfiguratsiyasi

`.env.local` faylida quyidagi o'zgaruvchilar sozlangan bo'lishi kerak:

```env
NEXT_PUBLIC_S3_REGION=us-east-1
NEXT_PUBLIC_S3_URL=https://your-contabo-endpoint.com
NEXT_PUBLIC_S3_BUCKET=elektromart
NEXT_PUBLIC_S3_ACCESS_KEY_ID=your-access-key-id
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=your-secret-access-key
```

### Fayl Tuzilmasi

```
lib/s3/
├── s3-client.ts          # S3 client konfiguratsiyasi
├── upload.ts             # Yuklash funksiyasi
├── list.ts               # Ro'yxatni olish funksiyasi
└── delete.ts             # O'chirish funksiyasi
```

### API Funksiyalari

#### listObjectsFromS3()
```typescript
const result = await listObjectsFromS3(
  bucket: string,           // Bucket nomi
  prefix: string,           // Papka prefixi (masalan: "images/")
  continuationToken?: string, // Pagination uchun
  maxKeys: number           // Maksimal natijalar soni
);

// Qaytaradi:
{
  objects: S3ObjectInfo[],
  isTruncated: boolean,
  nextContinuationToken?: string
}
```

#### uploadToObjectStorage()
```typescript
await uploadToObjectStorage(
  bucket: string,           // Bucket nomi
  key: string,              // Fayl yo'li (masalan: "images/photo.jpg")
  body: Uint8Array,         // Fayl ma'lumotlari
  contentType: string       // MIME type (masalan: "image/jpeg")
);
```

#### deleteFromObjectStorage()
```typescript
await deleteFromObjectStorage(
  bucket: string,           // Bucket nomi
  key: string               // Fayl yo'li
);
```

### Rasm URL Formati

Rasmlar quyidagi URL formatida yuklanadi:
```
{S3_BASE_URL}/{BUCKET_NAME}/{key}
```

Masalan:
```
https://your-contabo-endpoint.com/elektromart/images/1730467200000-photo.jpg
```

## Xatoliklarni Bartaraf Etish

### 1. Rasmlar yuklanmayapti
- `.env.local` faylidagi S3 credentials'larni tekshiring
- S3 endpoint URL to'g'riligini tekshiring
- Bucket nomi to'g'riligini tekshiring
- Browser console'da xatolarni ko'ring

### 2. Yuklash ishlamayapti
- Fayl hajmi 10MB dan oshmaganligini tekshiring
- Fayl formati qo'llab-quvvatlanishini tekshiring
- S3 bucket'da write permission borligini tekshiring

### 3. O'chirish ishlamayapti
- S3 bucket'da delete permission borligini tekshiring
- Fayl haqiqatan ham S3 da mavjudligini tekshiring

### 4. CORS xatolari
S3 bucket'da CORS sozlamalarini tekshiring:
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"]
    }
  ]
}
```

## Kelajakdagi Yaxshilanishlar

- [ ] Drag & drop yuklash
- [ ] Rasmlarni tahrirlash (crop, resize)
- [ ] Rasmlarni papkalarga ajratish
- [ ] Pagination (ko'p rasmlar uchun)
- [ ] Bulk operations (ko'p rasmlarni bir vaqtda yuklash)
- [ ] Rasm preview modal
- [ ] Copy URL to clipboard
- [ ] Rasm ma'lumotlarini ko'rish (metadata)

## Qo'shimcha Ma'lumot

Agar qo'shimcha yordam kerak bo'lsa yoki muammo yuzaga kelsa:
1. Browser console'ni tekshiring
2. Network tab'da API so'rovlarni ko'ring
3. `.env.local` faylidagi sozlamalarni qayta tekshiring
4. S3 bucket permissions'larni tekshiring
