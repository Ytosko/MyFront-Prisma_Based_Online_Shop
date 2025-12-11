# 🛒 White-Label E-commerce Platform

> ⚠️ **PROTOTYPE** - This is a prototype/demo application showcasing a white-label e-commerce platform. Not intended for production use without further development.

A modern, customizable e-commerce storefront built with Next.js 15, designed for easy white-labeling and rapid deployment.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)

---

## ✨ Features

### Storefront
- 🏠 Beautiful, responsive homepage with hero, categories, and product sections
- 🛍️ Product catalog with search, filters, sorting, and pagination
- 🛒 Shopping cart with drawer UI
- 📱 Fully responsive design
- 🎨 Customizable branding (logo, colors, store name)

### Admin Panel
- 📊 Dashboard with stats and quick actions
- 📦 Product management (CRUD)
- 📋 Order management with status tracking
- 📧 Contact form submissions
- ⚙️ Store settings configuration
- 🔐 Secure authentication with NextAuth

### Additional Pages
- 📞 Contact page with form (saves to database)
- 📜 Privacy Policy page
- 📋 Terms of Service page
- 🚫 Custom 404 page

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd myfront
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma db push
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Storefront: [http://localhost:3000](http://localhost:3000)
   - Admin Panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (admin)/          # Admin panel routes
│   ├── (storefront)/     # Public storefront routes
│   ├── api/              # API routes
│   └── actions/          # Server actions
├── components/
│   ├── admin/            # Admin-specific components
│   ├── cart/             # Cart components
│   ├── storefront/       # Storefront components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and configurations
└── prisma/               # Database schema and seeds
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Prisma | Database ORM |
| SQLite | Database (easily swappable) |
| NextAuth.js | Authentication |
| Zustand | Client state management |
| Lucide React | Icons |
| Shadcn/ui | UI components |

---

## 🔮 Future Development Roadmap

This is a prototype with significant room for enhancement. Here are planned and potential features:

### High Priority
- [ ] **Dynamic Category Management** - CRUD for categories in admin panel
- [ ] **Category Filtering** - Filter products by category on storefront
- [ ] **Image Upload** - Integrate Cloudinary/S3 for product image uploads
- [ ] **Payment Integration** - Stripe/PayPal checkout flow
- [ ] **User Authentication** - Customer accounts and order history

### Medium Priority
- [ ] **Product Variants** - Size, color, and other variant support
- [ ] **Inventory Management** - Stock tracking and low-stock alerts
- [ ] **Coupon/Discount System** - Promo codes and sales
- [ ] **Email Notifications** - Order confirmations, shipping updates
- [ ] **Wishlist** - Save products for later
- [ ] **Product Reviews** - Customer reviews and ratings

### Future Enhancements
- [ ] **Multi-language Support** - i18n localization
- [ ] **Multi-currency** - Currency conversion
- [ ] **Analytics Dashboard** - Sales trends, visitor stats
- [ ] **SEO Optimization** - Sitemap, structured data
- [ ] **PWA Support** - Progressive Web App features
- [ ] **Webhooks** - Order events for external integrations
- [ ] **Tax Calculation** - Regional tax support
- [ ] **Shipping Calculator** - Real-time shipping rates
- [ ] **Blog/CMS** - Content management for marketing

### Infrastructure
- [ ] **PostgreSQL Migration** - Move from SQLite for production
- [ ] **Redis Caching** - Performance optimization
- [ ] **Docker Support** - Containerized deployment
- [ ] **CI/CD Pipeline** - Automated testing and deployment

---

## 🔐 Default Admin Credentials

After seeding, use these credentials to access the admin panel:

- **Email:** `admin@example.com`
- **Password:** `admin123`

> ⚠️ Change these immediately in production!

---

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Prisma database connection string | ✅ |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption | ✅ |
| `NEXTAUTH_URL` | Base URL of your application | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key (for payments) | ❌ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ❌ |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## ⚠️ Disclaimer

This is a **prototype application** intended for demonstration and learning purposes. Before using in production:

1. Implement proper security measures
2. Set up proper database (PostgreSQL recommended)
3. Configure proper authentication
4. Add comprehensive error handling
5. Implement payment processing securely
6. Add proper logging and monitoring

---

Built with ❤️ using Next.js
