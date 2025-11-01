# Category API - Tezkor Qo'llanma

## 🎯 Asosiy Komponentlar

### Frontend (Foydalanuvchilar uchun)

```tsx
// 1. Barcha kategoriyalar
import { CategoryList } from "@/components/category-list";
<CategoryList />

// 2. Bitta kategoriya kartasi
import { CategoryCard } from "@/components/category-card";
<CategoryCard category={category} />

// 3. Loading
import { CategorySkeleton } from "@/components/category-skeleton";
<CategorySkeleton />

// 4. Bo'sh holat
import { CategoryEmptyState } from "@/components/category-empty-state";
<CategoryEmptyState />
```

### Admin Panel (CRUD)

```tsx
// To'liq CRUD table
import { CategoryTable } from "@/components/admin/category-table";
<CategoryTable />

// Yoki faqat form
import { CategoryForm } from "@/components/admin/category-form";
<CategoryForm
  category={editingCategory}
  onSuccess={() => console.log("Saved!")}
  onCancel={() => console.log("Cancelled")}
/>
```

---

## 📡 API Chaqiruvlar

```typescript
import { categoriesAPI } from "@/lib/api";

// 1. Barcha kategoriyalar
const categories = await categoriesAPI.getAll();

// 2. Faqat parent kategoriyalar
const parents = await categoriesAPI.getHierarchy();

// 3. Bitta kategoriya
const category = await categoriesAPI.getById(1);

// 4. Sub-kategoriyalar
const subs = await categoriesAPI.getSubCategories(1);

// 5. Yaratish
const newCategory = await categoriesAPI.create({
  nameUz: "Maishiy texnika",
  nameRu: "Бытовая техника",
  image: file, // File yoki URL
  parentId: null, // null = parent
  order: 1
});

// 6. Yangilash
await categoriesAPI.update(1, {
  nameUz: "Yangi nom",
  isActive: false
});

// 7. O'chirish
await categoriesAPI.delete(1);
```

---

## 🌐 Til Almashtirish

```tsx
import { useLanguage } from "@/contexts/language-context";

const { language, t } = useLanguage();

// Variant 1: To'g'ridan-to'g'ri
const name = language === "uz" ? category.nameUz : category.nameRu;

// Variant 2: t() funksiyasi
<h1>{t("Kategoriyalar", "Категории")}</h1>
```

---

## 📄 Sahifalar

### Frontend
- `/categories` - Barcha kategoriyalar
- `/categories/1` - Bitta kategoriya + sub-kategoriyalar

### Admin
- `/admin/categories` - CRUD panel

---

## 🖼️ Image Upload

Image avtomatik upload bo'ladi:

```tsx
// Faqat File object bering
const formData = {
  nameUz: "Test",
  nameRu: "Тест",
  image: file // File object
};

await categoriesAPI.create(formData);
// Image avtomatik upload bo'lib, URL saqlanadi
```

---

## ✅ To'liq Misol

```tsx
"use client";

import { useState, useEffect } from "react";
import { categoriesAPI } from "@/lib/api";
import { CategoryCard } from "@/components/category-card";
import { CategorySkeleton } from "@/components/category-skeleton";
import { CategoryEmptyState } from "@/components/category-empty-state";

export default function MyPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getHierarchy();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CategorySkeleton />;
  if (categories.length === 0) return <CategoryEmptyState />;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} />
      ))}
    </div>
  );
}
```

---

## 🎨 Xususiyatlar

✅ **Loading skeleton** - Yuklanish vaqtida  
✅ **Empty state** - Bo'sh holat  
✅ **Ikki til** - O'zbek va Rus  
✅ **Image upload** - Max 2MB  
✅ **Responsive** - Barcha ekranlar  
✅ **Error handling** - Xatolarni boshqarish  
✅ **CRUD** - Create, Read, Update, Delete  
✅ **Parent/Sub** - Ierarxik struktura  

---

## 🚀 Ishga Tushirish

```bash
# 1. Backend serverni ishga tushiring
# Server /categories endpoint-larini qo'llab-quvvatlashi kerak

# 2. Environment o'rnating
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# 3. Frontend ishga tushiring
npm run dev

# 4. Test qiling
# Frontend: http://localhost:3000/categories
# Admin: http://localhost:3000/admin/categories
```

---

## 📝 Eslatma

- Barcha komponentlar **"use client"** directive bilan
- Til almashtirish avtomatik ishlaydi
- Image upload max **2MB**
- Parent kategoriya **parentId: null**
- Sub-kategoriya **parentId: number**
