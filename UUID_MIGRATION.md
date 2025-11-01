# ✅ UUID Migration - ID Types Updated

## 🔄 O'zgarishlar

Barcha `id` maydonlari `number` dan `string` (UUID) ga o'zgartirildi, chunki backend API UUID ishlatadi.

## 📝 Yangilangan type fayllar

### 1. Category Types
**Fayl:** `types/category.ts`
```typescript
// Oldin:
id: number
parentId: number | null

// Hozir:
id: string
parentId: string | null
```

### 2. Product Types
**Fayl:** `lib/api/products.ts`
```typescript
// Oldin:
id: number
categoryId: number

// Hozir:
id: string
categoryId: string
```

### 3. User Types
**Fayl:** `lib/api/users.ts` va `types/auth.ts`
```typescript
// Oldin:
id: number

// Hozir:
id: string
```

### 4. Slider Types
**Fayl:** `lib/api/sliders.ts`
```typescript
// Oldin:
id: number

// Hozir:
id: string
```

### 5. Banner Types
**Fayl:** `lib/api/banners.ts`
```typescript
// Oldin:
id: number

// Hozir:
id: string
```

## 📁 Yangilangan API fayllar

Barcha API funksiyalarida `id` parametrlari `string` ga o'zgartirildi:

1. ✅ `lib/api/categories.ts`
   - `getById(id: string)`
   - `getSubCategories(id: string)`
   - `update(id: string, data)`
   - `delete(id: string)`

2. ✅ `lib/api/products.ts`
   - `getById(id: string)`
   - `update(id: string, data)`
   - `delete(id: string)`
   - `getAll({ categoryId?: string })`

3. ✅ `lib/api/users.ts`
   - `getById(id: string)`
   - `update(id: string, data)`
   - `delete(id: string)`

4. ✅ `lib/api/sliders.ts`
   - `getById(id: string)`
   - `update(id: string, data)`
   - `delete(id: string)`

5. ✅ `lib/api/banners.ts`
   - `getById(id: string)`
   - `update(id: string, data)`
   - `delete(id: string)`

## 🎯 UUID Format

Backend dan kelayotgan ID lar endi UUID formatida:

```typescript
// Oldin (number):
id: 1
id: 2
id: 123

// Hozir (UUID string):
id: "550e8400-e29b-41d4-a716-446655440000"
id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
id: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
```

## 💡 UUID nima?

**UUID (Universally Unique Identifier)** - Bu global unikal identifikator:

- ✅ 128-bit raqam
- ✅ 36 ta belgi (32 hex + 4 tire)
- ✅ Format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- ✅ Har bir ID 100% unikal
- ✅ Distributed sistemalarda xavfsiz

## 🔍 Farqlar

### Number ID
```typescript
// Afzalliklari:
- Qisqa (1, 2, 3...)
- Oson o'qiladi
- Kamroq joy egallaydi

// Kamchiliklari:
- Distributed sistemalarda konflikt
- Ketma-ketlik taxmin qilinadi
- Xavfsizlik muammosi
```

### UUID
```typescript
// Afzalliklari:
- Global unikal
- Distributed sistemalarda xavfsiz
- Taxmin qilib bo'lmaydi
- Xavfsizroq

// Kamchiliklari:
- Uzunroq
- Ko'proq joy egallaydi
```

## 🧪 Test qilish

Endi barcha operatsiyalar UUID bilan ishlaydi:

```typescript
// Kategoriya olish
const category = await categoriesAPI.getById("550e8400-e29b-41d4-a716-446655440000");

// Mahsulot yangilash
await productsAPI.update("6ba7b810-9dad-11d1-80b4-00c04fd430c8", {
  name: "Yangi nom"
});

// Foydalanuvchi o'chirish
await usersAPI.delete("f47ac10b-58cc-4372-a567-0e02b2c3d479");
```

## ⚠️ Muhim

Endi `id` larni qiyoslashda:

```typescript
// ❌ Noto'g'ri (number bilan):
if (category.id === 1) { }
if (parseInt(category.id) === 1) { }

// ✅ To'g'ri (string bilan):
if (category.id === "550e8400-e29b-41d4-a716-446655440000") { }
if (category.id === selectedId) { }
```

## 📊 Migration Checklist

- ✅ Category types updated
- ✅ Product types updated
- ✅ User types updated
- ✅ Slider types updated
- ✅ Banner types updated
- ✅ All API functions updated
- ✅ TypeScript errors fixed

## 🚀 Natija

Endi barcha ID lar UUID formatida ishlaydi va backend API bilan to'liq mos keladi!

---

**Barcha type'lar UUID ga moslashtirildi!** 🎉
