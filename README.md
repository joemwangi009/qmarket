# Project Quantum - Crypto-Native E-commerce Platform

> The Future of Commerce is Decentralized

Project Quantum is a premium, production-ready, and highly scalable crypto-native e-commerce platform built with Next.js 14+. The platform facilitates cryptocurrency transactions while building trust, educating users, and providing a seamless, professional experience that rivals top-tier Web2 e-commerce sites.

## 🚀 Features

### Core E-commerce
- **Product Catalog**: Advanced filtering, sorting, and search capabilities
- **Shopping Cart**: Persistent cart with real-time crypto price calculations
- **Secure Checkout**: Multi-step checkout process with crypto payment options
- **Order Management**: Complete order lifecycle tracking
- **User Dashboard**: Order history and profile management

### Crypto Integration
- **Multi-Gateway Payments**: NOWPayments API (primary) + Coinbase Commerce (fallback)
- **Supported Cryptocurrencies**: BTC, ETH, USDT, USDC, BNB, LTC + trending altcoins
- **Real-time Pricing**: Live crypto price updates via CoinGecko API
- **Blockchain Integration**: Transaction hash tracking and verification

### Security & Trust
- **Supabase Auth**: Email/password, Google OAuth, GitHub OAuth
- **Advanced Security**: Rate limiting, CORS, input sanitization
- **SSL Encryption**: 256-bit encryption for all transactions
- **Privacy-First**: No personal data collection until post-payment

### User Experience
- **Modern UI/UX**: Built with Tailwind CSS and Framer Motion
- **Responsive Design**: Mobile-first approach
- **Performance**: ISR, optimized images, and blazing fast loads
- **Accessibility**: WCAG compliant components

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Framer Motion, Lucide React
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Payments**: NOWPayments API, Coinbase Commerce API
- **Deployment**: Vercel (Frontend/Backend), Supabase (Database/Auth)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Supabase account)
- NOWPayments API key
- Coinbase Commerce API key (optional)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd qmarket
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment variables file and configure your settings:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/qmarket"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Payment Gateways
NOWPAYMENTS_API_KEY="your-nowpayments-api-key"
NOWPAYMENTS_IPN_SECRET="your-nowpayments-ipn-secret"
COINBASE_COMMERCE_API_KEY="your-coinbase-commerce-api-key"
COINBASE_COMMERCE_WEBHOOK_SECRET="your-coinbase-webhook-secret"

# App Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Crypto APIs
COINGECKO_API_KEY="your-coingecko-api-key"

# Email (Optional - for notifications)
RESEND_API_KEY="your-resend-api-key"
```

## 📚 Documentation

This project includes comprehensive documentation covering setup, deployment, and usage:

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete project overview, architecture, and implementation details
- **[TECHNICAL_IMPLEMENTATION.md](./TECHNICAL_IMPLEMENTATION.md)** - Technical deep-dive, patterns, and best practices  
- **[MAINTENANCE_GUIDE.md](./MAINTENANCE_GUIDE.md)** - Quick reference for maintenance and troubleshooting
- **This README** - Quick start and overview

### 4. Database Setup

Initialize and push the database schema:

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the Database

Populate the database with sample data:

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🗄️ Database Schema

The application uses the following main models:

- **User**: Authentication and profile information
- **Product**: Product catalog with images and inventory
- **Order**: Order management and status tracking
- **Payment**: Payment processing and gateway responses
- **Address**: Shipping and billing addresses

## 🔐 Authentication

Project Quantum supports multiple authentication methods:

- **Email/Password**: Traditional email-based authentication
- **Google OAuth**: Sign in with Google account
- **GitHub OAuth**: Sign in with GitHub account

## 💳 Payment Integration

### NOWPayments (Primary Gateway)
- Extensive cryptocurrency support
- Real-time payment processing
- Webhook integration for order updates

### Coinbase Commerce (Fallback)
- Trusted and reliable payment processing
- Additional cryptocurrency options
- Seamless fallback integration

## 📱 API Endpoints

### Products
- `GET /api/products` - List and search products
- `GET /api/products/[id]` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/[id]` - Update product (admin only)
- `DELETE /api/products/[id]` - Delete product (admin only)

### Orders
- `GET /api/orders` - List user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/[id]` - Get order details

### Checkout
- `POST /api/checkout/sessions` - Create payment session

### Webhooks
- `POST /api/webhooks/payment` - Payment confirmation webhooks

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Environment Variables**: Add all environment variables in Vercel dashboard
3. **Build Settings**: 
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Deploy**: Vercel will automatically deploy on every push

### Supabase Setup

1. **Create Project**: Create a new Supabase project
2. **Database**: Use the provided PostgreSQL connection string
3. **Authentication**: Configure OAuth providers (Google, GitHub)
4. **Storage**: Set up Supabase Storage for product images
5. **Edge Functions**: Deploy webhook handlers if needed

### Environment Variables for Production

Ensure all production environment variables are properly configured:

```env
# Production Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Production URLs
NEXTAUTH_URL="https://yourdomain.com"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"

# Production API Keys
NOWPAYMENTS_API_KEY="your-production-api-key"
COINBASE_COMMERCE_API_KEY="your-production-api-key"
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

### Code Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Cart)
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── api/                # API route handlers
```

### Adding New Features

1. **Components**: Add new components in `src/components/`
2. **Pages**: Create new pages in `src/app/`
3. **API Routes**: Add new endpoints in `src/app/api/`
4. **Types**: Extend types in `src/types/index.ts`

## 🧪 Testing

### Running Tests

```bash
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
```

### Test Structure

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API endpoint and database tests
- **E2E Tests**: Full user journey tests

## 📊 Performance

### Optimization Features

- **Image Optimization**: Next.js Image component with automatic optimization
- **Code Splitting**: Automatic route-based code splitting
- **ISR**: Incremental Static Regeneration for dynamic content
- **CDN**: Global CDN distribution via Vercel
- **Caching**: Intelligent caching strategies

### Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Automatic error reporting and monitoring
- **Performance Metrics**: Core Web Vitals tracking

## 🔒 Security

### Security Features

- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Proper CORS configuration
- **Authentication**: Secure session management
- **HTTPS**: Enforced HTTPS in production

### Best Practices

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Implement proper error handling
- Regular security audits and updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use Prettier for code formatting
- Follow ESLint rules
- Write meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

### Common Issues

- **Build Errors**: Ensure all environment variables are set
- **Database Issues**: Check Prisma schema and database connection
- **Payment Issues**: Verify API keys and webhook configurations

## 🎯 Roadmap

### Upcoming Features

- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced inventory management
- [ ] AI-powered product recommendations
- [ ] DeFi integration (staking, yield farming)

### Version History

- **v1.0.0**: Initial release with core e-commerce functionality
- **v1.1.0**: Enhanced payment gateways and security features
- **v1.2.0**: Performance optimizations and mobile improvements

---

**Built with ❤️ for the decentralized future**

For more information, visit [Project Quantum](https://your-domain.com) or contact the development team.
