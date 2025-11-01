# Environment Setup

## .env.local Fayli

Loyihada `.env.local` fayli yaratilgan va quyidagi konfiguratsiya qo'shilgan:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# S3 Object Storage Configuration (Contabo)
NEXT_PUBLIC_S3_REGION=us-east-1
NEXT_PUBLIC_S3_URL=https://your-contabo-endpoint.com
NEXT_PUBLIC_S3_BUCKET=elektromart
NEXT_PUBLIC_S3_ACCESS_KEY_ID=your-access-key-id
NEXT_PUBLIC_S3_SECRET_ACCESS_KEY=your-secret-access-key
```

## Tushuntirish

### Backend API
- **NEXT_PUBLIC_API_URL** - Backend API server manzili
- Server **localhost:3001** portda ishlamoqda
- Barcha API so'rovlar `/api` prefixi bilan yuboriladi

### S3 Object Storage (Contabo)
- **NEXT_PUBLIC_S3_REGION** - S3 region (Contabo uchun istalgan qiymat, masalan: us-east-1)
- **NEXT_PUBLIC_S3_URL** - Contabo S3 endpoint URL
- **NEXT_PUBLIC_S3_BUCKET** - Bucket nomi (masalan: elektromart)
- **NEXT_PUBLIC_S3_ACCESS_KEY_ID** - S3 Access Key ID
- **NEXT_PUBLIC_S3_SECRET_ACCESS_KEY** - S3 Secret Access Key

## Gallery Sahifasi

Admin panelda `/admin/gallery` sahifasi S3 bilan to'liq integratsiya qilingan:

### Funksiyalar:
- ✅ S3 dan barcha rasmlarni ko'rish
- ✅ Rasm nomi bo'yicha qidirish
- ✅ Bir yoki bir nechta rasmlarni yuklash (modal orqali)
- ✅ Bitta yoki bir nechta rasmlarni tanlash va o'chirish
- ✅ Barcha rasmlarni tanlash/bekor qilish
- ✅ Rasmlarning hajmini ko'rsatish
- ✅ Loading va empty state'lar

### S3 Funksiyalari:
- `listObjectsFromS3()` - S3 dan rasmlar ro'yxatini olish
- `uploadToObjectStorage()` - S3 ga rasm yuklash
- `deleteFromObjectStorage()` - S3 dan rasmni o'chirish

## Ishlatish

Frontend loyiha avtomatik ravishda `.env.local` faylidagi qiymatlarni o'qiydi.

Agar server boshqa portda yoki domenda bo'lsa, `.env.local` faylini o'zgartiring:

```env
# Mahalliy ishlab chiqish
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Yoki production
NEXT_PUBLIC_API_URL=https://api.example.com

# Production S3
NEXT_PUBLIC_S3_URL=https://your-production-endpoint.com
```

## Eslatma

- `.env.local` fayli `.gitignore` da, shuning uchun Git-ga yuklanmaydi
- Har bir developer o'z `.env.local` faylini yaratishi kerak
- Production uchun environment variables hosting platformasida sozlanadi
- S3 credentials'larni hech qachon Git'ga yuklmang!
