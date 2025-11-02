# 🛒 Elektro Mart - Elektr Mahsulotlari Do'koni

Modern va professional elektr mahsulotlari onlayn do'koni. Next.js 16, React 19, TypeScript va Tailwind CSS asosida qurilgan.

## 🚀 Texnologiyalar

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **State Management**: React Context API
- **Image Storage**: AWS S3
- **Carousel**: Embla Carousel
- **Icons**: Lucide React
- **Forms**: React Hook Form

## 📦 Asosiy Funksiyalar

### Foydalanuvchilar uchun
- 🏠 **Bosh sahifa**: Hero slider, kategoriyalar, tanlangan mahsulotlar, brendlar
- 📱 **Responsive dizayn**: Barcha qurilmalarda mukammal ishlaydi
- 🔍 **Qidiruv va filtr**: Kategoriya, brend, narx, yangi/chegirmali mahsulotlar
- 🛍️ **Mahsulot katalogi**: To'liq ma'lumot, rasmlar galereyasi, spetsifikatsiyalar
- 🌐 **Ikki til**: O'zbek va Rus tillari
- ⭐ **SEO optimizatsiya**: Meta teglar, sitemap, robots.txt, structured data

### Admin Panel
- 👤 **Autentifikatsiya**: Login/logout tizimi
- 📂 **Kategoriyalar**: CRUD operatsiyalar, ota-bola kategoriyalar
- 🏷️ **Brendlar**: Brend boshqaruvi
- 📦 **Mahsulotlar**: To'liq CRUD, media gallery, spetsifikatsiyalar
- 🖼️ **Media Gallery**: AWS S3 bilan integratsiya
- 🎨 **Home Sliders**: Bosh sahifa uchun sliderlar
- 🎯 **Catalog Banners**: Katalog sahifasi uchun bannerlar

## 🛠️ O'rnatish

```bash
# Loyihani klonlash
git clone <repository-url>
cd elektro-mart

# Paketlarni o'rnatish
npm install

# Environment o'zgaruvchilarni sozlash
# .env.local faylini yarating va quyidagilarni qo'shing:
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_AWS_REGION=your_aws_region
NEXT_PUBLIC_AWS_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=your_access_key
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=your_secret_key

# Development serverni ishga tushirish
npm run dev
```

Brauzerda `http://localhost:3000` ochiladi.

## 📁 Loyiha Strukturasi

```
elektro-mart/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel sahifalari
│   ├── catalog/           # Katalog sahifasi
│   ├── products/          # Mahsulot sahifalari
│   └── ...
├── components/            # React komponentlar
│   ├── admin/            # Admin komponentlar
│   ├── ui/               # shadcn/ui komponentlar
│   └── ...
├── contexts/             # React Context
├── lib/                  # Utility funksiyalar va API
│   └── api/             # API client funksiyalar
├── types/               # TypeScript type definitions
└── public/              # Static fayllar
```

## 🎯 Asosiy Komponentlar

- **HeroSlider**: Bosh sahifa hero slider (API integratsiya)
- **CategorySlider**: Kategoriyalar slider
- **BrandsSlider**: Brendlar slider
- **ProductCard**: Mahsulot kartochkasi
- **ProductFilter**: Mahsulotlarni filtrlash
- **S3Image**: AWS S3 rasmlar uchun optimizatsiya

## 🔐 Admin Panel

Admin panelga kirish: `/admin/login`

Admin panel funksiyalari:
- Kategoriyalar boshqaruvi
- Brendlar boshqaruvi
- Mahsulotlar CRUD
- Media gallery
- Home sliders
- Catalog banners

## 🌐 API Integratsiya

Barcha ma'lumotlar backend API dan olinadi:
- Kategoriyalar
- Brendlar
- Mahsulotlar
- Home sliders
- Catalog banners

## 📱 Responsive Dizayn

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Dizayn Tizimi

- **Primary color**: Elektr ko'k rang
- **Typography**: System fonts
- **Spacing**: Tailwind spacing scale
- **Components**: shadcn/ui asosida

## 🚀 Production Build

```bash
# Build yaratish
npm run build

# Production serverni ishga tushirish
npm start
```

## 📄 Litsenziya

Private project

## 👨‍💻 Muallif

Elektro Mart jamoasi

---

**Eslatma**: Bu loyiha Next.js 16 va React 19 dan foydalanadi. Barcha zamonaviy funksiyalar va optimizatsiyalar qo'llanilgan.
