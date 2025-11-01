# Professional Folder Structure

Bu loyihada professional va modular folder structure qo'llanilgan.

## 📁 Folder Structure

```
/media/max/Ramzes1/React/elektro-mart/
├── lib/
│   ├── api/                          # API Modules (alohida)
│   │   ├── client.ts                 # Base API client
│   │   ├── upload.ts                 # Upload API
│   │   ├── categories.ts             # Categories API
│   │   ├── products.ts               # Products API
│   │   ├── users.ts                  # Users API
│   │   ├── sliders.ts                # Sliders API
│   │   ├── banners.ts                # Banners API
│   │   └── index.ts                  # Export all APIs
│   └── api.ts                        # Backward compatibility
│
├── components/
│   ├── admin/                        # Admin Components
│   │   ├── categories/               # Categories Module
│   │   │   ├── category-form.tsx
│   │   │   ├── category-table.tsx
│   │   │   └── index.ts
│   │   ├── products/                 # Products Module (kelgusida)
│   │   ├── users/                    # Users Module (kelgusida)
│   │   ├── sliders/                  # Sliders Module (kelgusida)
│   │   ├── banners/                  # Banners Module (kelgusida)
│   │   └── shared/                   # Shared Components
│   │       ├── crud-modal.tsx        # Umumiy CRUD modal
│   │       └── index.ts
│   │
│   └── ui/                           # UI Components (shadcn/ui)
│
├── app/
│   └── admin/
│       ├── categories/
│       │   └── page.tsx
│       ├── products/
│       │   └── page.tsx
│       ├── users/
│       │   └── page.tsx
│       ├── sliders/
│       │   └── page.tsx
│       └── banners/
│           └── page.tsx
│
└── types/
    └── category.ts                   # Category types
```

## 🎯 Afzalliklari

### 1. **Modular API Structure**
Har bir API moduli alohida faylda:
- ✅ Oson maintain qilish
- ✅ Code reusability
- ✅ Type safety
- ✅ Clear separation of concerns

```typescript
// Eski usul (bitta fayl)
import { categoriesAPI, productsAPI } from '@/lib/api';

// Yangi usul (modular)
import { categoriesAPI } from '@/lib/api';
import { productsAPI } from '@/lib/api';
```

### 2. **Component Modules**
Har bir admin modul o'z papkasida:
- ✅ Related components birga
- ✅ Easy to find
- ✅ Scalable structure
- ✅ Clean imports

```typescript
// Eski usul
import { CategoryForm } from '@/components/admin/category-form';
import { CategoryTable } from '@/components/admin/category-table';

// Yangi usul
import { CategoryForm, CategoryTable } from '@/components/admin/categories';
```

### 3. **Shared Components**
Umumiy komponentlar alohida:
- ✅ DRY principle
- ✅ Consistent UI
- ✅ Easy updates
- ✅ Reusable

```typescript
import { CrudModal } from '@/components/admin/shared';
```

## 📝 Ishlatish

### API Modules

```typescript
// Categories API
import { categoriesAPI } from '@/lib/api';

const categories = await categoriesAPI.getAll();
await categoriesAPI.create(data);
await categoriesAPI.update(id, data);
await categoriesAPI.delete(id);
```

### Admin Components

```typescript
// Categories Module
import { CategoryTable, CategoryForm } from '@/components/admin/categories';

// Shared Components
import { CrudModal } from '@/components/admin/shared';
```

## 🚀 Keyingi Qadamlar

1. **Products Module** - Products uchun alohida modul yaratish
2. **Users Module** - Users uchun alohida modul yaratish
3. **Sliders Module** - Sliders uchun alohida modul yaratish
4. **Banners Module** - Banners uchun alohida modul yaratish
5. **Shared Hooks** - Umumiy hooks yaratish (useCategories, useProducts, etc.)
6. **Shared Utils** - Umumiy utility funksiyalar

## 📚 Best Practices

1. **Har bir modul o'z index.ts-ga ega** - Clean exports
2. **Types alohida faylda** - Type safety
3. **API client alohida** - Reusable
4. **Shared components** - DRY principle
5. **Clear naming** - Readable code

## ✅ Completed

- ✅ API modular structure
- ✅ Categories admin module
- ✅ Shared CRUD modal
- ✅ Type-safe API calls
- ✅ Clean imports
- ✅ Backward compatibility

## 🔄 Migration

Eski kod avtomatik ishlaydi (backward compatibility):

```typescript
// Bu hali ham ishlaydi
import { categoriesAPI } from '@/lib/api';
```

Lekin yangi kod uchun modular import tavsiya etiladi.
