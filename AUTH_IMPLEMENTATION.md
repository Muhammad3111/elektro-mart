# Authentication Implementation Guide

## ✅ Implemented Features

### 1. **Authentication System**
- ✅ Login with email/password
- ✅ Registration with full user details
- ✅ JWT token management (localStorage)
- ✅ Auto-redirect after login based on role
- ✅ Logout functionality

### 2. **Admin Protection**
- ✅ Admin routes protected with `AdminGuard`
- ✅ Non-admin users redirected to 404
- ✅ Unauthenticated users redirected to login
- ✅ Loading states during authentication check

### 3. **User Roles**
- ✅ **Admin**: Full access to admin panel
- ✅ **User**: Regular user, no admin access

---

## 📁 File Structure

```
/media/max/Ramzes1/React/elektro-mart/
├── types/
│   └── auth.ts                          # Auth types & interfaces
├── lib/api/
│   ├── auth.ts                          # Auth API functions
│   └── index.ts                         # Export auth API
├── contexts/
│   └── auth-context.tsx                 # Auth state management
├── components/admin/
│   ├── admin-guard.tsx                  # Admin route protection
│   └── admin-layout.tsx                 # Updated with logout
├── app/
│   ├── layout.tsx                       # Added AuthProvider
│   ├── auth/page.tsx                    # Login/Register page
│   ├── 404/page.tsx                     # 404 page for unauthorized
│   └── admin/                           # Protected admin routes
└── AUTH_IMPLEMENTATION.md               # This file
```

---

## 🔐 How It Works

### Authentication Flow

```
1. User visits /admin
   ↓
2. AdminGuard checks authentication
   ↓
3a. Not logged in → Redirect to /auth?redirect=/admin
3b. Logged in but not admin → Redirect to /404
3c. Logged in as admin → Show admin panel
```

### Login Flow

```
1. User enters email & password
   ↓
2. POST /api/auth/login
   ↓
3. Receive { user, access_token }
   ↓
4. Save token to localStorage
   ↓
5. Update auth context state
   ↓
6. Redirect based on role:
   - Admin → /admin
   - User → /
```

### Register Flow

```
1. User fills registration form
   ↓
2. POST /api/auth/register
   ↓
3. Receive { user, access_token }
   ↓
4. Save token to localStorage
   ↓
5. Update auth context state
   ↓
6. Redirect to home page
```

---

## 🚀 Usage Examples

### 1. Login as Admin

```typescript
// Default admin credentials
Email: admin@elektromart.com
Password: password123!

// After login, user is redirected to /admin
```

### 2. Register New User

```typescript
// Registration form
{
  email: "user@example.com",
  password: "SecurePass123!",
  firstName: "John",
  lastName: "Doe",
  phone: "+998901234567" // Optional
}

// After registration, user is redirected to /
```

### 3. Using Auth in Components

```typescript
import { useAuth } from "@/contexts/auth-context";

function MyComponent() {
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.firstName}!</p>
      {isAdmin && <p>You are an admin!</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 4. Protecting Custom Routes

```typescript
import { AdminGuard } from "@/components/admin/admin-guard";

export default function MyAdminPage() {
  return (
    <AdminGuard>
      <div>This is only visible to admins</div>
    </AdminGuard>
  );
}
```

---

## 🔧 API Integration

### Base URL
```
http://localhost:3001/api
```

### Available Endpoints

#### 1. **Login**
```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: { user: User, access_token: string }
```

#### 2. **Register**
```typescript
POST /api/auth/register
Body: {
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string
}
Response: { user: User, access_token: string }
```

#### 3. **Get Profile**
```typescript
GET /api/auth/profile
Headers: { Authorization: "Bearer {token}" }
Response: User
```

#### 4. **Update Profile**
```typescript
PUT /api/auth/profile
Headers: { Authorization: "Bearer {token}" }
Body: { firstName?: string, lastName?: string, phone?: string }
Response: User
```

#### 5. **Change Password**
```typescript
POST /api/auth/change-password
Headers: { Authorization: "Bearer {token}" }
Body: { oldPassword: string, newPassword: string }
Response: { message: string }
```

---

## 🎯 Key Components

### 1. **AuthContext** (`contexts/auth-context.tsx`)

Provides authentication state and functions throughout the app.

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}
```

### 2. **AdminGuard** (`components/admin/admin-guard.tsx`)

Protects admin routes from unauthorized access.

```typescript
<AdminGuard>
  {/* Only admins can see this */}
</AdminGuard>
```

### 3. **Auth API** (`lib/api/auth.ts`)

Handles all authentication API calls.

```typescript
import { authAPI } from "@/lib/api";

// Login
await authAPI.login({ email, password });

// Register
await authAPI.register({ email, password, firstName, lastName });

// Get profile
const user = await authAPI.getProfile();

// Logout
authAPI.logout(); // Removes token from localStorage
```

---

## 🔒 Security Features

1. **JWT Token Storage**: Tokens stored in localStorage
2. **Auto Token Validation**: Profile loaded on app mount
3. **Protected Routes**: AdminGuard prevents unauthorized access
4. **Role-Based Access**: Admin vs User roles
5. **Password Requirements**: Minimum 6 characters
6. **Error Handling**: User-friendly error messages

---

## 🎨 UI Features

### Login Page (`/auth`)
- Email & password fields
- Show/hide password toggle
- Loading states
- Switch to register
- Auto-redirect if already logged in

### Register Page (`/auth`)
- First name & last name
- Email & phone
- Password with validation
- Loading states
- Switch to login

### Admin Layout
- Logout button in header
- Language switcher
- Protected by AdminGuard

---

## 📝 Environment Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🧪 Testing

### Test Admin Login
```bash
Email: admin@elektromart.com
Password: password123!
```

### Test User Registration
1. Go to `/auth`
2. Click "Ro'yxatdan o'tish"
3. Fill in the form
4. Submit
5. You'll be logged in and redirected to home

### Test Admin Protection
1. Logout if logged in
2. Try to visit `/admin`
3. You'll be redirected to `/auth?redirect=/admin`
4. Login as admin
5. You'll be redirected back to `/admin`

### Test Non-Admin Protection
1. Register/login as regular user
2. Try to visit `/admin` directly
3. You'll be redirected to `/404`

---

## 🐛 Troubleshooting

### Issue: "Cannot access admin panel"
**Solution**: Make sure you're logged in as admin (admin@elektromart.com)

### Issue: "Token expired"
**Solution**: Logout and login again. Tokens expire after 24 hours.

### Issue: "API connection error"
**Solution**: 
1. Check if backend is running on `http://localhost:3001`
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Issue: "Infinite redirect loop"
**Solution**: Clear localStorage and try again
```javascript
localStorage.removeItem('access_token');
```

---

## 🚀 Next Steps

1. **Email Verification**: Add email verification for new users
2. **Password Reset**: Implement forgot password functionality
3. **Remember Me**: Add "Remember me" checkbox
4. **2FA**: Two-factor authentication for admins
5. **Session Management**: Better token refresh mechanism
6. **Audit Log**: Track admin actions

---

## 📚 Related Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Category Integration](./CATEGORY_INTEGRATION.md)
- [Category Quickstart](./CATEGORY_QUICKSTART.md)

---

## ✨ Summary

The authentication system is now fully functional with:

- ✅ Secure login/register
- ✅ JWT token management
- ✅ Admin route protection
- ✅ Role-based access control
- ✅ User-friendly UI with loading states
- ✅ Proper error handling
- ✅ Language support (Uzbek/Russian)

**Only admin users can access the admin panel. Regular users will see a 404 page if they try to access admin routes.**
