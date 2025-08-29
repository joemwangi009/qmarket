# 🛠️ Quick Maintenance Guide

## 🚀 **Daily Operations**

### **Start Development Server**
```bash
npm run dev
# Server starts at http://localhost:3000
```

### **Build for Production**
```bash
npm run build
# Creates optimized build in .next/ directory
```

### **Run Linting**
```bash
npm run lint
# Checks for code quality issues
```

---

## 🗄️ **Database Operations**

### **Test Database Connection**
```bash
npm run db:test
# Verifies database connectivity
```

### **Create/Update Database Tables**
```bash
npm run db:migrate
# Runs database migration scripts
```

### **Populate Sample Data**
```bash
npm run db:seed
# Adds sample products, users, and orders
```

---

## 🔧 **Common Issues & Quick Fixes**

### **Build Failures**

#### **"Module not found" errors**
```bash
# Clean build cache
rm -rf .next
npm run build
```

#### **TypeScript compilation errors**
```bash
# Check for type issues
npm run lint
# Fix any 'any' types or missing imports
```

### **Database Connection Issues**

#### **"DATABASE_URL is not set"**
```bash
# Check .env file exists
ls -la .env

# Verify DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

#### **Connection timeout**
```bash
# Test connection
npm run db:test

# Check Supabase dashboard for connection limits
```

### **Environment Variable Problems**

#### **Scripts can't access .env**
```bash
# Ensure dotenv is installed
npm install dotenv

# Check scripts have: import 'dotenv/config'
```

---

## 📁 **File Structure Reference**

```
qmarket/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin dashboard
│   │   ├── dashboard/         # User dashboard
│   │   ├── products/          # Product catalog
│   │   └── product/[slug]/    # Product details
│   ├── components/            # Reusable UI components
│   ├── contexts/              # React Context providers
│   ├── lib/                   # Utility functions
│   │   └── db.ts             # Database connection
│   └── types/                 # TypeScript type definitions
├── scripts/                   # Database scripts
│   ├── migrate.ts            # Table creation
│   └── seed.ts               # Sample data
├── .env                       # Environment variables
└── package.json              # Dependencies and scripts
```

---

## 🔐 **Environment Variables Checklist**

### **Required Variables**
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
NODE_ENV="development"
```

### **Optional Variables**
```bash
# Email Service
RESEND_API_KEY="[API-KEY]"

# Analytics
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"

# Error Monitoring
SENTRY_DSN="[DSN]"

# Caching
REDIS_URL="redis://localhost:6379"
```

---

## 🚨 **Emergency Procedures**

### **Database Down**
1. **Check Supabase status** - [status.supabase.com](https://status.supabase.com)
2. **Verify connection string** in `.env`
3. **Test connection** - `npm run db:test`
4. **Check connection limits** in Supabase dashboard

### **Build Broken**
1. **Clean cache** - `rm -rf .next node_modules`
2. **Reinstall dependencies** - `npm install`
3. **Check TypeScript errors** - `npm run lint`
4. **Verify file paths** and imports

### **Payment Gateway Issues**
1. **Check NOWPayments status**
2. **Verify API keys** in `.env`
3. **Check webhook endpoints**
4. **Review payment logs** in admin dashboard

---

## 📊 **Monitoring & Health Checks**

### **Application Health**
```bash
# Check if app is running
curl http://localhost:3000/api/health

# Monitor build status
npm run build

# Check for linting issues
npm run lint
```

### **Database Health**
```bash
# Test database connection
npm run db:test

# Check table structure
npm run db:migrate

# Verify sample data
npm run db:seed
```

---

## 🔄 **Update Procedures**

### **Dependencies Update**
```bash
# Check for updates
npm outdated

# Update packages
npm update

# Update specific package
npm install package@latest

# Test after updates
npm run build
npm run lint
```

### **Database Schema Updates**
1. **Modify migration script** in `scripts/migrate.ts`
2. **Test locally** - `npm run db:migrate`
3. **Deploy changes**
4. **Run migration** on production

---

## 📝 **Logging & Debugging**

### **Enable Debug Logging**
```bash
# Set debug environment variable
DEBUG=* npm run dev

# Or add to .env
DEBUG=*
```

### **Common Log Locations**
- **Application logs** - Console output
- **Database logs** - Supabase dashboard
- **Build logs** - `.next/` directory
- **Error logs** - Browser console

---

## 🆘 **Getting Help**

### **Documentation**
- **This guide** - Quick reference
- **DOCUMENTATION.md** - Comprehensive details
- **TECHNICAL_IMPLEMENTATION.md** - Technical deep-dive

### **Common Commands Reference**
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting

# Database
npm run db:test      # Test connection
npm run db:migrate   # Run migrations
npm run db:seed      # Seed sample data

# Utilities
npm install          # Install dependencies
npm update           # Update dependencies
npm audit            # Security audit
```

---

**Last Updated**: January 2025  
**Maintainer**: Development Team  
**Quick Reference Version**: 1.1.0 