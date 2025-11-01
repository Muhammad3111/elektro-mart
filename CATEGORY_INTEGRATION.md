# Category API Integration Documentation

Bu dokumentatsiya category API-ni admin panel va frontend-ga qanday ulanganligi haqida to'liq ma'lumot beradi.

## 📁 Fayl Strukturasi

```
/media/max/Ramzes1/React/elektro-mart/
├── types/
│   └── category.ts                    # Category type definitions
├── lib/
│   └── api.ts                         # API client (categoriesAPI)
├── components/
│   ├── category-card.tsx              # Bitta kategoriya kartasi
│   ├── category-list.tsx              # Kategoriyalar ro'yxati
│   ├── category-skeleton.tsx          # Loading skeletons
│   ├── category-empty-state.tsx       # Bo'sh holat komponenti
│   └── admin/
│       ├── category-form.tsx          # CRUD form (create/edit)
│       └── category-table.tsx         # Admin table with CRUD
├── app/
│   ├── categories/
│   │   ├── page.tsx                   # Barcha kategoriyalar sahifasi
│   │   └── [slug]/
│   │       └── page.tsx               # Bitta kategoriya + sub-kategoriyalar
│   └── admin/
│       └── categories/
│           └── page.tsx               # Admin CRUD panel
```

## 🔌 API Endpoints

### Backend API (Server)

Barcha endpoint-lar `/categories` prefixi bilan:

#### 1. **GET /categories**
Barcha kategoriyalarni olish (parent va sub-kategoriyalar)

**Response:**
```json
[
  {
    "id": 1,
    "nameUz": "Maishiy texnika",
    "nameRu": "Бытовая техника",
    "image": "1234567890-1234.jpg",
    "parentId": null,
    "order": 1,
    "isActive": true,
    "subCategories": [...]
  }
]
```

#### 2. **GET /categories/hierarchy**
Faqat parent kategoriyalarni olish (sub-kategoriyalar nested)

**Response:**
```json
[
  {
    "id": 1,
    "nameUz": "Maishiy texnika",
    "nameRu": "Бытовая техника",
    "image": "1234567890-1234.jpg",
    "parentId": null,
    "order": 1,
    "isActive": true,
    "subCategories": [
      {
        "id": 2,
        "nameUz": "Muzlatgichlar",
        "nameRu": "Холодильники",
        "image": "1234567891-5678.jpg",
        "parentId": 1,
        "order": 1,
        "isActive": true
      }
    ]
  }
]
```

#### 3. **GET /categories/:id**
Bitta kategoriyani ID bo'yicha olish

**Response:**
```json
{
  "id": 1,
  "nameUz": "Maishiy texnika",
  "nameRu": "Бытовая техника",
  "image": "1234567890-1234.jpg",
  "parentId": null,
  "order": 1,
  "isActive": true,
  "parent": null,
  "subCategories": [...]
}
```

#### 4. **GET /categories/:id/subcategories**
Bitta kategoriyaning sub-kategoriyalarini olish

**Response:**
```json
[
  {
    "id": 2,
    "nameUz": "Muzlatgichlar",
    "nameRu": "Холодильники",
    "image": "1234567891-5678.jpg",
    "parentId": 1,
    "order": 1,
    "isActive": true
  }
]
```

#### 5. **POST /categories**
Yangi kategoriya yaratish (parent yoki sub)

**Request Body:**
```json
{
  "nameUz": "Maishiy texnika",
  "nameRu": "Бытовая техника",
  "image": "file or url",
  "parentId": null,  // null = parent, number = sub-category
  "order": 1
}
```

**Response:**
```json
{
  "id": 1,
  "nameUz": "Maishiy texnika",
  "nameRu": "Бытовая техника",
  "image": "1234567890-1234.jpg",
  "parentId": null,
  "order": 1,
  "isActive": true,
  "subCategories": []
}
```

#### 6. **PUT /categories/:id**
Kategoriyani yangilash

**Request Body:**
```json
{
  "nameUz": "Yangi nom",
  "nameRu": "Новое название",
  "image": "new-image.jpg",
  "parentId": 1,
  "order": 2,
  "isActive": false
}
```

#### 7. **DELETE /categories/:id**
Kategoriyani o'chirish

**Response:**
```json
{
  "message": "Category deleted successfully"
}
```

---

## 🎨 Frontend Components

### 1. CategoryList Component
**Fayl:** `/components/category-list.tsx`

Barcha parent kategoriyalarni ko'rsatadi.

**Xususiyatlar:**
- ✅ Loading skeleton
- ✅ Empty state
- ✅ Til almashtirish (uz/ru)
- ✅ Avtomatik API chaqiruv

**Ishlatish:**
```tsx
import { CategoryList } from "@/components/category-list";

<CategoryList />
```

### 2. CategoryCard Component
**Fayl:** `/components/category-card.tsx`

Bitta kategoriya kartasi.

**Xususiyatlar:**
- ✅ Rasm ko'rsatish (agar mavjud bo'lsa)
- ✅ Placeholder (rasm yo'q bo'lsa)
- ✅ Til almashtirish
- ✅ Sub-kategoriyalar soni
- ✅ Hover effektlar

**Ishlatish:**
```tsx
import { CategoryCard } from "@/components/category-card";

<CategoryCard category={category} />
```

### 3. CategorySkeleton Component
**Fayl:** `/components/category-skeleton.tsx`

Loading holatini ko'rsatadi.

**Ishlatish:**
```tsx
import { CategorySkeleton } from "@/components/category-skeleton";

{loading && <CategorySkeleton />}
```

### 4. CategoryEmptyState Component
**Fayl:** `/components/category-empty-state.tsx`

Bo'sh holat (kategoriyalar yo'q).

**Xususiyatlar:**
- ✅ Ikki tilda xabar
- ✅ Icon bilan
- ✅ Responsive

**Ishlatish:**
```tsx
import { CategoryEmptyState } from "@/components/category-empty-state";

{categories.length === 0 && <CategoryEmptyState />}
```

---

## 🔧 Admin Panel Components

### 1. CategoryForm Component
**Fayl:** `/components/admin/category-form.tsx`

Kategoriya yaratish/tahrirlash formasi.

**Xususiyatlar:**
- ✅ Image upload (max 2MB)
- ✅ Image preview
- ✅ Ikki tilda input (nameUz, nameRu)
- ✅ Parent kategoriya tanlash
- ✅ Order input
- ✅ Validatsiya
- ✅ Loading state

**Props:**
```typescript
interface CategoryFormProps {
  category?: Category;        // Edit uchun
  onSuccess: () => void;      // Muvaffaqiyatli saqlanganda
  onCancel: () => void;       // Bekor qilish
}
```

**Ishlatish:**
```tsx
import { CategoryForm } from "@/components/admin/category-form";

<CategoryForm
  category={editingCategory}
  onSuccess={handleSuccess}
  onCancel={handleCancel}
/>
```

### 2. CategoryTable Component
**Fayl:** `/components/admin/category-table.tsx`

Admin CRUD table (to'liq boshqaruv).

**Xususiyatlar:**
- ✅ Parent va sub-kategoriyalar ko'rinishi
- ✅ Create yangi kategoriya
- ✅ Edit kategoriya
- ✅ Delete kategoriya
- ✅ Toggle isActive
- ✅ Rasm ko'rsatish
- ✅ Loading skeleton
- ✅ Empty state
- ✅ Dialog modal
- ✅ Ikki tilda

**Ishlatish:**
```tsx
import { CategoryTable } from "@/components/admin/category-table";

<CategoryTable />
```

---

## 📄 Pages

### 1. Categories Page (Frontend)
**Fayl:** `/app/categories/page.tsx`

Barcha kategoriyalarni ko'rsatadi.

**URL:** `/categories`

### 2. Category Detail Page (Frontend)
**Fayl:** `/app/categories/[slug]/page.tsx`

Bitta kategoriya va uning sub-kategoriyalarini ko'rsatadi.

**URL:** `/categories/1` (ID)

**Xususiyatlar:**
- ✅ Category header (rasm + nom)
- ✅ Sub-kategoriyalar grid
- ✅ Breadcrumb navigation
- ✅ Loading state
- ✅ Error handling

### 3. Admin Categories Page
**Fayl:** `/app/admin/categories/page.tsx`

Admin panel CRUD sahifasi.

**URL:** `/admin/categories`

---

## 🌐 Til Almashtirish (Language Context)

Barcha komponentlar `useLanguage` hook-dan foydalanadi:

```tsx
import { useLanguage } from "@/contexts/language-context";

const { language, t } = useLanguage();

// Ishlatish
const name = language === "uz" ? category.nameUz : category.nameRu;

// Yoki
<h1>{t("Kategoriyalar", "Категории")}</h1>
```

---

## 🖼️ Image Upload

Image upload avtomatik ishlaydi:

1. **Frontend:** User rasm tanlaydi (max 2MB)
2. **API Client:** `categoriesAPI.create()` yoki `update()` chaqirilganda:
   - Agar `image` File bo'lsa → `uploadAPI.uploadImage()` chaqiriladi
   - Upload URL qaytadi
   - URL bilan kategoriya saqlanadi

**Kod:**
```typescript
// lib/api.ts
create: async (data: any) => {
  if (data.image instanceof File) {
    const uploadResult = await uploadAPI.uploadImage(data.image);
    data.image = uploadResult.url;
  }
  
  return apiRequest<any>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
```

---

## ✅ Validatsiya

### Frontend Validatsiya
- `nameUz` va `nameRu` majburiy
- Image max 2MB
- Order minimum 1

### Backend Validatsiya (Server)
- Kategoriya o'zini parent qilib belgilay olmaydi
- Mavjud bo'lmagan parentId kiritish mumkin emas
- `nameUz` va `nameRu` majburiy

---

## 🎯 Qo'shimcha Xususiyatlar

### 1. Loading States
Barcha komponentlarda loading skeleton mavjud:
- `CategorySkeleton` - grid skeleton
- `CategoryListSkeleton` - list skeleton

### 2. Empty States
Kategoriyalar bo'lmasa:
- `CategoryEmptyState` - ikki tilda xabar
- Icon bilan
- Responsive

### 3. Error Handling
Barcha API chaqiruvlarda error handling:
```tsx
try {
  const data = await categoriesAPI.getAll();
  setCategories(data);
} catch (err) {
  console.error("Failed to load:", err);
  toast.error("Xatolik / Ошибка");
}
```

### 4. Responsive Design
- Mobile: 2 columns
- Tablet: 3-4 columns
- Desktop: 6 columns

---

## 🚀 Ishga Tushirish

### 1. Backend Server
Serverda `/categories` endpoint-lari ishlashi kerak.

### 2. Environment Variables
`.env.local` faylida:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Development
```bash
npm run dev
```

### 4. Test Qilish

**Frontend:**
- `/categories` - Barcha kategoriyalar
- `/categories/1` - Bitta kategoriya

**Admin:**
- `/admin/categories` - CRUD panel

---

## 📝 Misol: Yangi Kategoriya Yaratish

### Admin Panel Orqali:
1. `/admin/categories` ga o'ting
2. "Qo'shish / Добавить" tugmasini bosing
3. Formani to'ldiring:
   - Rasm yuklang (optional)
   - O'zbek nomini kiriting
   - Rus nomini kiriting
   - Parent kategoriya tanlang (optional)
   - Tartib raqamini kiriting
4. "Yaratish / Создать" tugmasini bosing

### API Orqali:
```typescript
import { categoriesAPI } from "@/lib/api";

const newCategory = await categoriesAPI.create({
  nameUz: "Maishiy texnika",
  nameRu: "Бытовая техника",
  image: file, // File object yoki URL
  parentId: null, // null = parent
  order: 1
});
```

---

## 🐛 Troubleshooting

### Kategoriyalar ko'rinmayapti
1. Backend server ishlab turibdimi?
2. API URL to'g'rimi? (`NEXT_PUBLIC_API_URL`)
3. Console-da error bormi?

### Rasm yuklanmayapti
1. Fayl hajmi 2MB dan oshmaydimi?
2. Upload endpoint ishlayaptimi? (`/upload`)
3. File type to'g'rimi? (image/*)

### Til almashtirilmayapti
1. `LanguageProvider` o'rnatilganmi?
2. `useLanguage` hook ishlatilganmi?
3. `nameUz` va `nameRu` to'ldirilganmi?

---

## 📞 Qo'shimcha Ma'lumot

Agar qo'shimcha yordam kerak bo'lsa:
- Backend API dokumentatsiyasini tekshiring
- Component props-larini o'qing
- Console error-larni tekshiring
- Network tab-da API response-larni ko'ring

---

**Yaratilgan:** 2025-01-31
**Versiya:** 1.0.0
