# Migration Guide: Uzbek to English/Russian

## Overview

This project has been migrated from Uzbek/Russian language support to English/Russian for the frontend, while maintaining 3-language SEO support (English/Russian/Uzbek).

## Major Changes

### 1. Site Configuration

-   **Company Name**: Worldwide Technology Solutions (WWTS)
-   **Domain**: wwts.uz
-   **Address**: г.Ташкент, Шайхонтохурский район, ул.Алишера Навои, дом 16А

### 2. Language System

-   **Frontend**: English/Russian (en/ru)
-   **Admin Panel**: Uzbek/Russian (uz/ru) - uses translation function
-   **SEO**: 3 languages (en/ru/uz) for better search engine coverage
-   **API**: All fields changed from `*Uz` to `*En` (nameUz → nameEn, etc.)

### 3. Database Schema Changes

All database fields need to be renamed:

-   `nameUz` → `nameEn`
-   `titleUz` → `titleEn`
-   `subtitleUz` → `subtitleEn`
-   `descriptionUz` → `descriptionEn`
-   `shortDescriptionUz` → `shortDescriptionEn`
-   `labelUz` → `labelEn`
-   `valueUz` → `valueEn`
-   `commentUz` → `commentEn`

### 4. S3/Storage Configuration

**New Contabo Configuration:**

-   Endpoint: `https://eu2.contabostorage.com`
-   Bucket: `wwts`
-   Region: `eu-2`

See `CONTABO_S3_SETUP.md` for detailed configuration.

### 5. Type Definitions Updated

All TypeScript interfaces updated:

-   `types/product.ts`
-   `types/category.ts`
-   `types/brand.ts`
-   `types/slider.ts`
-   `types/order.ts`

### 6. Component Updates

All components updated to use English instead of Uzbek:

-   Product cards and details
-   Category and brand displays
-   Hero sliders
-   Admin forms
-   Search and filters

## Backend Migration Required

### Database Migration SQL

```sql
-- Products table
ALTER TABLE products RENAME COLUMN "nameUz" TO "nameEn";
ALTER TABLE products RENAME COLUMN "descriptionUz" TO "descriptionEn";
ALTER TABLE products RENAME COLUMN "shortDescriptionUz" TO "shortDescriptionEn";

-- Categories table
ALTER TABLE categories RENAME COLUMN "nameUz" TO "nameEn";

-- Brands table
ALTER TABLE brands RENAME COLUMN "nameUz" TO "nameEn";

-- Sliders table
ALTER TABLE home_sliders RENAME COLUMN "titleUz" TO "titleEn";
ALTER TABLE home_sliders RENAME COLUMN "subtitleUz" TO "subtitleEn";

ALTER TABLE catalog_banners RENAME COLUMN "titleUz" TO "titleEn";

-- Specifications table
ALTER TABLE specifications RENAME COLUMN "labelUz" TO "labelEn";
ALTER TABLE specifications RENAME COLUMN "valueUz" TO "valueEn";

-- Reviews table (if exists)
ALTER TABLE reviews RENAME COLUMN "commentUz" TO "commentEn";
```

### API Endpoints

Ensure all API endpoints return fields with `En` suffix instead of `Uz`:

-   GET /api/products → returns `nameEn`, `descriptionEn`, etc.
-   GET /api/categories → returns `nameEn`
-   GET /api/brands → returns `nameEn`
-   POST/PUT requests should accept `nameEn` fields

## Testing Checklist

-   [ ] Frontend displays English text correctly
-   [ ] Language switcher works (EN/RU)
-   [ ] Admin panel works with new field names
-   [ ] Product creation/editing works
-   [ ] Category creation/editing works
-   [ ] Brand creation/editing works
-   [ ] Slider creation/editing works
-   [ ] Search functionality works
-   [ ] SEO meta tags include all 3 languages
-   [ ] Images load from Contabo S3
-   [ ] Build completes without errors

## Environment Variables

Update your `.env` files with:

```env
NEXT_PUBLIC_SITE_URL=https://wwts.uz
NEXT_PUBLIC_S3_URL=https://eu2.contabostorage.com
NEXT_PUBLIC_S3_BUCKET_NAME=wwts
NEXT_PUBLIC_S3_REGION=eu-2
```

## Rollback Plan

If issues occur:

1. Revert database column names
2. Revert code to previous commit
3. Update environment variables back to old values
