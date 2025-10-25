# ElektroMart - SEO Documentation

## 📋 Umumiy Ma'lumot

ElektroMart sayti uchun professional SEO sozlamalari amalga oshirildi. Barcha sahifalar Google, Yandex va boshqa qidiruv tizimlari uchun optimallashtirilgan.

---

## 🎯 Asosiy SEO Komponentlar

### 1. **Root Layout Metadata** (`app/layout.tsx`)
- ✅ Site-wide title template
- ✅ Default meta description
- ✅ Keywords array
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Robots meta tags
- ✅ Canonical URL
- ✅ Google & Yandex verification codes

### 2. **SEO Component** (`components/seo.tsx`)
Client-side SEO component har bir sahifa uchun:
- Dynamic title updates
- Meta description
- Keywords
- Canonical URLs
- Open Graph tags
- Twitter Cards
- Robots directives (index/noindex)

### 3. **Structured Data** (`components/structured-data.tsx`)
JSON-LD schema markup:
- **WebSite** - Sayt haqida ma'lumot
- **Organization** - Kompaniya ma'lumotlari
- **Product** - Mahsulot ma'lumotlari
- **BreadcrumbList** - Navigatsiya yo'li

---

## 📄 Sahifalar bo'yicha SEO

### 🏠 **Bosh Sahifa** (`/`)
```typescript
Title: "Bosh sahifa - Professional elektr mahsulotlari | ElektroMart"
Description: "O'zbekistonda eng yaxshi elektr kabel, ulagichlar, rozetkalar..."
Keywords: "elektr kabel, kabel sotib olish, ulagichlar, rozetkalar..."
Canonical: "/"
Index: ✅ Yes
```
**Structured Data:**
- WebSite schema
- Organization schema

---

### 📚 **Katalog** (`/catalog`)
```typescript
Title: "Katalog - Barcha mahsulotlar | ElektroMart"
Description: "ElektroMart katalogi - elektr kabel, ulagichlar, rozetkalar..."
Keywords: "elektr katalog, kabel katalog, elektr mahsulotlari..."
Canonical: "/catalog"
Index: ✅ Yes
```

---

### 🛒 **Savat** (`/cart`)
```typescript
Title: "Savat - Xarid qilish | ElektroMart"
Description: "Sizning xarid savatangiz. Buyurtmani rasmiylashtirish..."
Canonical: "/cart"
Index: ❌ No (noindex, nofollow)
```

---

### 💳 **Checkout** (`/checkout`)
```typescript
Title: "Buyurtmani rasmiylashtirish | ElektroMart"
Description: "Buyurtmangizni rasmiylashtiring. Tez yetkazib berish..."
Canonical: "/checkout"
Index: ❌ No (noindex, nofollow)
```

---

### ✅ **Order Confirmation** (`/order-confirmation`)
```typescript
Title: "Buyurtma tasdiqlandi | ElektroMart"
Description: "Buyurtmangiz muvaffaqiyatli qabul qilindi..."
Canonical: "/order-confirmation"
Index: ❌ No (noindex, nofollow)
```

---

### ℹ️ **Biz Haqimizda** (`/about`)
```typescript
Title: "Biz haqimizda | ElektroMart"
Description: "ElektroMart - O'zbekistonda professional elektr mahsulotlari..."
Keywords: "elektromart haqida, elektr mahsulotlari kompaniya..."
Canonical: "/about"
Index: ✅ Yes
```

---

## 🗺️ Sitemap & Robots

### **Sitemap** (`app/sitemap.ts`)
Avtomatik generatsiya qilinadigan XML sitemap:
- `/` - Priority: 1.0, Daily
- `/catalog` - Priority: 0.9, Daily
- `/about` - Priority: 0.7, Monthly
- `/contact` - Priority: 0.6, Monthly

**URL:** `https://elektromart.uz/sitemap.xml`

---

### **Robots.txt** (`app/robots.ts`)
```
User-agent: *
Allow: /
Disallow: /cart
Disallow: /checkout
Disallow: /order-confirmation
Disallow: /auth

Sitemap: https://elektromart.uz/sitemap.xml
```

---

## 🏷️ Open Graph Tags

Barcha sahifalarda:
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://elektromart.uz/..." />
<meta property="og:image" content="https://elektromart.uz/og-image.jpg" />
<meta property="og:site_name" content="ElektroMart" />
<meta property="og:locale" content="uz_UZ" />
```

---

## 🐦 Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="https://elektromart.uz/og-image.jpg" />
```

---

## 📊 Structured Data Examples

### WebSite Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ElektroMart",
  "url": "https://elektromart.uz",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://elektromart.uz/catalog?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ElektroMart",
  "url": "https://elektromart.uz",
  "logo": "https://elektromart.uz/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+998-90-123-45-67",
    "contactType": "customer service"
  }
}
```

### Product Schema (Mahsulot sahifalari uchun)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "RG6 Koaksial Kabel",
  "description": "Professional koaksial kabel...",
  "image": "...",
  "brand": {
    "@type": "Brand",
    "name": "Siemens"
  },
  "offers": {
    "@type": "Offer",
    "price": "45000",
    "priceCurrency": "UZS",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "bestRating": "5",
    "ratingCount": "100"
  }
}
```

---

## 🎨 Kerakli Fayllar

### 1. **OG Image** (`/public/og-image.jpg`)
- Size: 1200x630px
- Format: JPG
- Content: ElektroMart logo va branding

### 2. **Logo** (`/public/logo.png`)
- Size: 512x512px
- Format: PNG
- Transparent background

### 3. **Favicon** (`/public/favicon.ico`)
- Size: 32x32px
- Format: ICO

---

## ✅ SEO Checklist

- [x] Meta title har bir sahifada
- [x] Meta description har bir sahifada
- [x] Keywords relevant sahifalarda
- [x] Canonical URLs
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Structured Data (JSON-LD)
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Noindex private sahifalarda
- [x] Mobile-friendly
- [x] Fast loading
- [x] HTTPS ready

---

## 🔧 Keyingi Qadamlar

### 1. **Google Search Console**
- Saytni qo'shish
- Sitemap yuborish
- Verification code qo'shish

### 2. **Yandex Webmaster**
- Saytni ro'yxatdan o'tkazish
- Sitemap yuborish
- Verification code qo'shish

### 3. **Analytics**
- Google Analytics o'rnatish
- Yandex Metrica o'rnatish
- Conversion tracking

### 4. **Performance**
- Image optimization
- Code splitting
- Lazy loading
- CDN setup

---

## 📞 Qo'shimcha Ma'lumot

Agar SEO sozlamalarini yangilash kerak bo'lsa:

1. **Root metadata** - `app/layout.tsx`
2. **Sahifa SEO** - Har bir sahifada `<SEO />` component
3. **Structured Data** - `<StructuredData />` component
4. **Sitemap** - `app/sitemap.ts`
5. **Robots** - `app/robots.ts`

---

**Yaratilgan sana:** 2024
**Versiya:** 1.0
**Holat:** ✅ Production Ready
