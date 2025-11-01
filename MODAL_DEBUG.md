# Modal Debugging Guide

## Muammo
Admin panel sahifalarida "Yangi qo'shish" tugmasi bosilganda modal ochilmayapti.

## Test Qilish

1. **Browser Console-ni oching** (F12)
2. **Admin Categories sahifasiga o'ting:** `http://localhost:3000/admin/categories`
3. **"Qo'shish / Добавить" tugmasini bosing**
4. **Console-da quyidagilarni tekshiring:**
   - Xatolar bormi?
   - `dialogOpen` state o'zgaradimi?
   - Dialog element DOM-da bormi?

## Tekshirish Buyruqlari

Browser Console-da:

```javascript
// Dialog state-ni tekshirish
console.log("Dialog elements:", document.querySelectorAll('[role="dialog"]'));

// Overlay-ni tekshirish  
console.log("Overlays:", document.querySelectorAll('[data-radix-dialog-overlay]'));

// Z-index muammosini tekshirish
const dialogs = document.querySelectorAll('[role="dialog"]');
dialogs.forEach(d => console.log("Dialog z-index:", window.getComputedStyle(d).zIndex));
```

## Keng Tarqalgan Muammolar

### 1. Portal Muammosi
Dialog Radix Portal-dan foydalanadi. Ba'zan SSR bilan muammo bo'ladi.

**Yechim:** Client-side render qilish
```tsx
"use client";
```

### 2. Z-index Muammosi
Dialog ko'rinmayapti (lekin ochilgan).

**Yechim:** Dialog z-index tekshirish
```css
[data-radix-dialog-overlay] {
  z-index: 50;
}
```

### 3. State Muammosi
State o'zgarayapti, lekin UI yangilanmayapti.

**Yechim:** React DevTools-da state-ni tekshiring

## Tezkor Test

Test sahifani oching:
```
http://localhost:3000/test-dialog
```

Agar bu ishlasa, muammo CategoryForm-da.
Agar ishlamasa, muammo Dialog component-da.
