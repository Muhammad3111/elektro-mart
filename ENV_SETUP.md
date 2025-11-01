# Environment Setup

## .env.local Fayli

Loyihada `.env.local` fayli yaratilgan va quyidagi konfiguratsiya qo'shilgan:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Tushuntirish

- **NEXT_PUBLIC_API_URL** - Backend API server manzili
- Server **localhost:3001** portda ishlamoqda
- Barcha API so'rovlar `/api` prefixi bilan yuboriladi

## Ishlatish

Frontend loyiha avtomatik ravishda `.env.local` faylidagi qiymatlarni o'qiydi.

Agar server boshqa portda yoki domenda bo'lsa, `.env.local` faylini o'zgartiring:

```env
# Mahalliy ishlab chiqish
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Yoki production
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Eslatma

- `.env.local` fayli `.gitignore` da, shuning uchun Git-ga yuklanmaydi
- Har bir developer o'z `.env.local` faylini yaratishi kerak
- Production uchun environment variables hosting platformasida sozlanadi
