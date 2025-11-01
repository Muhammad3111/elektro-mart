# 🚀 Quick Start Guide

## Admin Login

```
URL: http://localhost:3000/auth
Email: admin@elektromart.com
Password: password123!
```

After login, you'll be automatically redirected to `/admin`

## Important Notes

### ✅ Admin Access
- **Only admin users** can access `/admin` routes
- Admin role is checked on every page load
- Logout button is in the top-right corner of admin panel

### ❌ Non-Admin Users
- Regular users **cannot** access admin panel
- If they try to visit `/admin`, they will see **404 page**
- This is for security - admin panel is protected

### 🔐 Security Features
1. **JWT Token**: Stored in localStorage
2. **Auto-redirect**: Unauthenticated users → `/auth`
3. **Role check**: Non-admin users → `/404`
4. **Loading state**: Shows loader while checking auth

## Testing Flow

### Test 1: Admin Login
```bash
1. Visit http://localhost:3000/auth
2. Enter: admin@elektromart.com / password123!
3. Click "Kirish" (Login)
4. ✅ You should be redirected to /admin
```

### Test 2: Regular User Registration
```bash
1. Visit http://localhost:3000/auth
2. Click "Ro'yxatdan o'tish" (Register)
3. Fill in the form with your details
4. Click "Ro'yxatdan o'tish" (Register)
5. ✅ You should be redirected to home page
```

### Test 3: Non-Admin Protection
```bash
1. Logout if logged in as admin
2. Register/login as regular user
3. Try to visit http://localhost:3000/admin
4. ✅ You should see 404 page (access denied)
```

### Test 4: Logout
```bash
1. Login as admin
2. Click logout button (top-right corner)
3. ✅ You should be redirected to /auth
4. ✅ Token should be removed from localStorage
```

## API Backend

Make sure your NestJS backend is running:

```bash
cd /path/to/backend
npm run start:dev
```

Backend should be running on: `http://localhost:3001`

## Environment Setup

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## File Structure

```
✅ types/auth.ts                    # Auth types
✅ lib/api/auth.ts                  # Auth API
✅ contexts/auth-context.tsx        # Auth state
✅ components/admin/admin-guard.tsx # Route protection
✅ app/auth/page.tsx                # Login/Register
✅ app/404/page.tsx                 # Unauthorized page
✅ app/layout.tsx                   # AuthProvider added
```

## Common Issues

### Backend not running?
```bash
# Start backend
cd backend
npm run start:dev
```

### Token expired?
```bash
# Clear localStorage
localStorage.removeItem('access_token');
# Then login again
```

### Can't access admin?
```bash
# Make sure you're using admin credentials:
Email: admin@elektromart.com
Password: password123!
```

## Language Support

The entire auth system supports both languages:
- 🇺🇿 Uzbek (default)
- 🇷🇺 Russian

Switch language using the globe icon in the header.

---

**Ready to go! 🎉**

For detailed documentation, see [AUTH_IMPLEMENTATION.md](./AUTH_IMPLEMENTATION.md)
