# 🚀 Project Quantum - Comprehensive Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Database Design](#database-design)
4. [Implementation Details](#implementation-details)
5. [Critical Issues & Solutions](#critical-issues--solutions)
6. [API Documentation](#api-documentation)
7. [Component Architecture](#component-architecture)
8. [Deployment Guide](#deployment-guide)
9. [Maintenance & Troubleshooting](#maintenance--troubleshooting)
10. [Future Enhancements](#future-enhancements)

---

## 🎯 Project Overview

**Project Quantum** is a premium, production-ready crypto-native e-commerce platform built with Next.js 14+ that facilitates cryptocurrency transactions while building user trust and providing a seamless shopping experience.

### 🎯 **Key Objectives**
- Facilitate crypto transactions securely
- Build user trust through professional UX
- Educate users about crypto payments
- Provide seamless e-commerce experience
- Support multiple cryptocurrencies
- Implement role-based access control

---

## 🏗️ Architecture & Tech Stack

### **Frontend Framework**
- **Next.js 15.5.2** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animations

### **Backend & Database**
- **PostgreSQL** via Supabase
- **Direct SQL queries** with `pg` library
- **Connection pooling** for performance
- **Supabase Auth** for authentication

### **Payment Integration**
- **NOWPayments** (Primary gateway)
- **Webhook handling** for payment confirmations
- **Multi-crypto support** (BTC, ETH, USDT, USDC, BNB, LTC, ADA, DOT, LINK, MATIC)

### **State Management**
- **React Context** for cart and auth
- **TanStack Query** for data fetching
- **Local storage** for cart persistence

---

## 🗄️ Database Design

### **Core Tables**

#### **users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  inventory INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  images TEXT[],
  specifications JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **orders**
```sql
CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **order_items**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **shipping_addresses**
```sql
CREATE TABLE shipping_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **payments**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(50) REFERENCES orders(id) ON DELETE CASCADE,
  transaction_hash VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  gateway VARCHAR(50) DEFAULT 'nowpayments',
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Database Indexes**
```sql
-- Performance optimization indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_transaction_hash ON payments(transaction_hash);
```

---

## 🔧 Implementation Details

### **Database Connection Management**
```typescript
// src/lib/db.ts
export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    pool = new Pool({
      connectionString,
      max: 20, // Maximum connections
      idleTimeoutMillis: 30000, // Close idle connections
      connectionTimeoutMillis: 2000, // Connection timeout
    })
  }
  return pool
}
```

### **API Route Implementation**
```typescript
// src/app/api/orders/route.ts
export async function GET() {
  try {
    const ordersResult = await query(`
      SELECT
        o.id, o.status, o.total, o.subtotal, o.shipping, o.tax,
        o.payment_method, o.created_at,
        oi.name as item_name, oi.quantity, oi.price as item_price,
        sa.first_name, sa.last_name, sa.address, sa.city, sa.state,
        sa.zip_code, sa.country
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN shipping_addresses sa ON o.id = sa.order_id
      ORDER BY o.created_at DESC
    `)

    return NextResponse.json(ordersResult.rows || [])
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
```

---

## 🚨 Critical Issues & Solutions

### **Issue 1: Prisma Client Initialization Problems**
**Problem**: Prisma client failed to initialize during build, causing `@prisma/client did not initialize yet` errors.

**Root Cause**: Prisma client generation issues and connection problems in production builds.

**Solution**: 
- **Replaced Prisma ORM with direct SQL queries**
- **Implemented custom database connection pooling** using `pg` library
- **Created `lib/db.ts` utility** for database operations
- **Added proper error handling** and connection management

**Code Example**:
```typescript
// Before (Prisma - problematic)
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// After (Direct SQL - reliable)
import { query } from '@/lib/db'
const result = await query('SELECT * FROM products WHERE category = $1', ['Electronics'])
```

### **Issue 2: Server-Side Rendering (SSR) Hydration Errors**
**Problem**: `Error occurred prerendering page "/_not-found"` due to passing non-plain objects from server to client components.

**Root Cause**: QueryClient and other complex objects being passed to client components during SSR.

**Solution**:
- **Created dedicated `Providers` client component** to wrap the app
- **Moved all client-side providers** into a single component
- **Separated server and client rendering** boundaries properly

**Code Example**:
```typescript
// Before (problematic)
// layout.tsx - mixing server and client components

// After (solution)
// layout.tsx - server component
import { Providers } from '@/components/Providers'

// Providers.tsx - client component
'use client'
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
```

### **Issue 3: Supabase Client Initialization During Build**
**Problem**: `supabaseUrl is required` errors during build time.

**Root Cause**: Supabase client being imported and initialized during server-side rendering.

**Solution**:
- **Made Supabase client initialization conditional**
- **Added null checks** throughout the codebase
- **Implemented graceful fallbacks** for missing environment variables

**Code Example**:
```typescript
// Before (problematic)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// After (solution)
let supabase: SupabaseClient | null = null

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
```

### **Issue 4: TypeScript Strict Type Safety**
**Problem**: Multiple `any` type errors and type mismatches.

**Root Cause**: Loose typing and implicit any types.

**Solution**:
- **Replaced all `any` types** with proper TypeScript types
- **Added explicit type definitions** for all functions and variables
- **Implemented proper interface definitions** for data structures

**Code Example**:
```typescript
// Before (problematic)
function handleData(data: any) { ... }

// After (solution)
interface UserData {
  id: string
  email: string
  role: 'user' | 'admin'
}

function handleData(data: UserData) { ... }
```

### **Issue 5: Environment Variable Loading in Scripts**
**Problem**: Migration and seed scripts couldn't access environment variables.

**Root Cause**: `tsx` command doesn't automatically load `.env` files like Next.js.

**Solution**:
- **Installed `dotenv` package** for environment variable loading
- **Added `import 'dotenv/config'`** to all database scripts
- **Updated package.json scripts** to use proper paths

**Code Example**:
```typescript
// Before (problematic)
import { query } from '../src/lib/db'
// DATABASE_URL not accessible

// After (solution)
import 'dotenv/config'
import { query } from '../src/lib/db'
// DATABASE_URL now accessible
```

### **Issue 6: File Path Resolution and Module Imports**
**Problem**: Module resolution errors due to incorrect import paths.

**Root Cause**: Mismatch between TypeScript path mapping and actual file locations.

**Solution**:
- **Moved `lib` directory** to `src/lib` to match path mapping
- **Updated all import paths** to use `@/lib/*` consistently
- **Fixed package.json scripts** to use correct relative paths

**Code Example**:
```typescript
// tsconfig.json path mapping
"paths": {
  "@/*": ["./src/*"]
}

// Correct import usage
import { query } from '@/lib/db'
```

---

## 🔌 API Documentation

### **Orders API (`/api/orders`)**

#### **GET /api/orders**
Fetches all orders with related data.

**Response**:
```json
[
  {
    "id": "ORD-001",
    "status": "Delivered",
    "total": 299.99,
    "subtotal": 274.99,
    "shipping": 0,
    "tax": 25.00,
    "payment_method": "BTC",
    "created_at": "2024-01-15T10:30:00Z",
    "item_name": "Premium Wireless Headphones",
    "quantity": 1,
    "item_price": 274.99,
    "first_name": "John",
    "last_name": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "US"
  }
]
```

#### **POST /api/orders**
Creates a new order and generates payment URL.

**Request Body**:
```json
{
  "items": [
    {
      "name": "Product Name",
      "quantity": 1,
      "price": 99.99
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "paymentMethod": "BTC"
}
```

**Response**:
```json
{
  "order": {
    "id": "ORD-123",
    "status": "Pending",
    "total": 107.99
  },
  "paymentRedirectUrl": "https://api.nowpayments.io/v1/payment?...",
  "message": "Order created successfully"
}
```

---

## 🧩 Component Architecture

### **Page Components**
- **`/`** - Homepage with hero, featured products, trust indicators
- **`/products`** - Product catalog with filtering and search
- **`/product/[slug]`** - Product details with image gallery and pricing
- **`/cart`** - Shopping cart management
- **`/checkout`** - Multi-step checkout process
- **`/dashboard`** - User dashboard with order history
- **`/admin`** - Admin panel with analytics and management tools

### **Core Components**
- **`Navigation`** - Main navigation with cart and auth
- **`ProductGrid`** - Product display with grid/list views
- **`ProductFilters`** - Advanced filtering and search
- **`OrderSummary`** - Persistent checkout summary
- **`ProductImageGallery`** - Image gallery with navigation

### **Context Providers**
- **`AuthProvider`** - User authentication state
- **`CartProvider`** - Shopping cart management
- **`QueryClientProvider`** - Data fetching and caching

---

## 🚀 Deployment Guide

### **Environment Variables Required**
```bash
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[SERVICE-ROLE-KEY]"

# Payment Gateway
NOWPAYMENTS_API_KEY="[API-KEY]"
NOWPAYMENTS_WEBHOOK_SECRET="[WEBHOOK-SECRET]"
NOWPAYMENTS_IPN_SECRET="[IPN-SECRET]"

# Application
NEXTAUTH_URL="[YOUR-DOMAIN]"
JWT_SECRET="[RANDOM-SECRET]"
NODE_ENV="production"
```

### **Deployment Steps**
1. **Build the application**: `npm run build`
2. **Set environment variables** in your hosting platform
3. **Deploy to Vercel** or your preferred hosting service
4. **Run database migration**: `npm run db:migrate`
5. **Seed initial data**: `npm run db:seed`

---

## 🛠️ Maintenance & Troubleshooting

### **Common Issues & Solutions**

#### **Database Connection Issues**
**Symptoms**: Connection timeout or pool exhaustion
**Solution**: 
```bash
# Check connection pool status
npm run db:test

# Restart application to reset connections
# Monitor connection usage in Supabase dashboard
```

#### **Build Failures**
**Symptoms**: TypeScript compilation errors
**Solution**:
```bash
# Clean build cache
rm -rf .next
npm run build

# Check for type errors
npm run lint
```

#### **Environment Variable Issues**
**Symptoms**: "DATABASE_URL is not set" errors
**Solution**:
```bash
# Verify .env file exists and has correct values
# Check environment variable loading in scripts
# Ensure dotenv is properly imported
```

### **Database Maintenance**
```bash
# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Test database connection
npm run db:test
```

---

## 🔮 Future Enhancements

### **Short Term (1-3 months)**
- [ ] **Real-time notifications** using Supabase Realtime
- [ ] **Advanced search** with Elasticsearch integration
- [ ] **Inventory management** with low-stock alerts
- [ ] **Email notifications** for order updates

### **Medium Term (3-6 months)**
- [ ] **Multi-language support** with i18n
- [ ] **Advanced analytics** dashboard
- [ ] **Mobile app** using React Native
- [ ] **API rate limiting** and security enhancements

### **Long Term (6+ months)**
- [ ] **AI-powered recommendations**
- [ ] **Blockchain integration** for decentralized payments
- [ ] **Multi-tenant architecture** for B2B
- [ ] **Advanced fraud detection**

---

## 📚 Additional Resources

### **Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### **Code Examples**
- [Database queries](https://github.com/your-repo/examples)
- [Component patterns](https://github.com/your-repo/components)
- [API implementations](https://github.com/your-repo/api)

### **Support & Community**
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](https://discord.gg/your-community)
- [Documentation Wiki](https://github.com/your-repo/wiki)

---

## 📝 Changelog

### **Version 1.0.0** - Initial Release
- ✅ Complete e-commerce platform
- ✅ Crypto payment integration
- ✅ Admin dashboard
- ✅ User authentication
- ✅ Product management
- ✅ Order processing

### **Version 1.1.0** - Database Refactoring
- ✅ Replaced Prisma with direct SQL
- ✅ Implemented connection pooling
- ✅ Added comprehensive error handling
- ✅ Improved performance and stability

---

**Last Updated**: January 2025  
**Maintainer**: Development Team  
**Documentation Version**: 1.1.0 