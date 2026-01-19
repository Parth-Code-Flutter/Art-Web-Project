# Project Structure

This document outlines the complete folder structure and organization of the Art Gallery project.

## 📁 Root Directory

```
art-gallery/
├── database/              # Database setup and migration scripts
├── public/               # Static assets
├── src/                  # Source code
└── [config files]        # Next.js, TypeScript, Tailwind configs
```

## 📁 Source Code Structure (`src/`)

### Application Routes (`src/app/`)

```
src/app/
├── admin/               # Admin dashboard routes
│   ├── dashboard/
│   ├── products/
│   ├── sellers/
│   ├── orders/
│   └── analytics/
├── customer/            # Customer-facing routes
│   ├── dashboard/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── wishlist/
│   ├── settings/
│   └── categories/
├── seller/              # Seller dashboard routes
│   ├── dashboard/
│   ├── products/
│   ├── orders/
│   └── become-artist/
├── login/               # Authentication page
├── auth/                # Auth callback handlers
│   └── callback/
└── layout.tsx           # Root layout
```

### Components (`src/components/`)

```
src/components/
├── admin/               # Admin-specific components
│   ├── AdminSidebar.tsx
│   ├── ProductModal.tsx
│   ├── SellerModal.tsx
│   ├── CategoryModal.tsx
│   ├── SellerDetailView.tsx
│   ├── ShippingManager.tsx
│   └── EmptyStateGraphic.tsx
├── customer/            # Customer-specific components
│   ├── DashboardHeader.tsx
│   ├── CustomerFooter.tsx
│   ├── SearchBar.tsx
│   ├── ProductFilters.tsx
│   ├── WishlistButton.tsx
│   ├── ShareModal.tsx
│   ├── BentoHero.tsx
│   └── VirtualMockup.tsx
├── seller/              # Seller-specific components
│   └── SellerProductModal.tsx
├── providers/           # Context providers and trackers
│   ├── ToastProvider.tsx
│   ├── ThemeProvider.tsx
│   └── AnalyticsPageTracker.tsx
├── shared/              # Shared components (used across all apps)
│   ├── Button.tsx
│   ├── Loading.tsx
│   └── index.ts
└── ui/                  # Generic UI components
    ├── ThemeToggle.tsx
    └── Skeleton.tsx
```

### Utilities (`src/utils/`)

```
src/utils/
├── format.ts            # Formatting utilities (currency, dates, etc.)
├── validation.ts        # Validation utilities (email, phone, etc.)
├── helpers.ts           # General helper functions
└── index.ts             # Central export point
```

### Library & Configuration (`src/lib/`, `src/config/`)

```
src/lib/
├── supabase.ts          # Supabase client configuration
├── analytics.tsx        # Google Analytics setup
└── errors.ts            # Error handling utilities

src/config/
└── fonts.ts             # Font configurations
```

### Contexts (`src/contexts/`)

```
src/contexts/
└── WishlistContext.tsx  # Wishlist state management
```

### Constants (`src/constants/`)

```
src/constants/
└── [app constants]      # Application-wide constants
```

## 📁 Database (`database/`)

```
database/
├── setup/               # Initial setup scripts
│   ├── supabase_customers.sql
│   ├── supabase_admins.sql
│   ├── supabase_orders.sql
│   ├── shipping_schema.sql
│   ├── registration_trigger.sql
│   └── [policy fixes]
├── migrations/          # Future migration scripts
└── README.md            # Database documentation
```

## 🎯 Key Principles

### 1. **Separation of Concerns**
- Each user type (Admin, Customer, Seller) has its own folder
- Shared code lives in `shared/` and `utils/`
- Providers are isolated in `providers/`

### 2. **Scalability**
- Clear folder structure supports growth
- Easy to add new features within existing structure
- Utilities are modular and reusable

### 3. **Maintainability**
- Related code is grouped together
- Clear naming conventions
- Comprehensive documentation

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (e.g., `DashboardHeader.tsx`)
- **Utilities**: camelCase (e.g., `format.ts`)
- **Routes**: kebab-case folders (e.g., `become-artist/`)

### Folders
- **Feature folders**: Descriptive names (e.g., `customer/`, `admin/`)
- **Utility folders**: Lowercase (e.g., `utils/`, `lib/`)

## 🚀 Adding New Features

### Adding a New Customer Feature
1. Create route in `src/app/customer/[feature-name]/`
2. Add components in `src/components/customer/`
3. Add utilities in `src/utils/` if needed
4. Update navigation in `DashboardHeader.tsx`

### Adding a New Shared Component
1. Create in `src/components/shared/`
2. Export from `src/components/shared/index.ts`
3. Import using `@/components/shared`

### Adding a New Utility
1. Add function to appropriate file in `src/utils/`
2. Export from that file
3. It's automatically available via `@/utils`

## 📚 Import Aliases

The project uses TypeScript path aliases:

```typescript
@/components/*  → src/components/*
@/utils/*       → src/utils/*
@/lib/*         → src/lib/*
@/config/*      → src/config/*
@/contexts/*    → src/contexts/*
@/constants/*   → src/constants/*
```

## 🔍 Finding Code

- **UI Components**: Check `src/components/[user-type]/`
- **Business Logic**: Check route files in `src/app/`
- **Utilities**: Check `src/utils/`
- **Configuration**: Check `src/lib/` or `src/config/`
- **Database**: Check `database/setup/`

## 🛠️ Best Practices

1. **Keep components focused**: One component, one responsibility
2. **Use shared components**: Don't duplicate code across user types
3. **Leverage utilities**: Extract common logic to utils
4. **Document complex logic**: Add comments for non-obvious code
5. **Follow the structure**: Don't create new top-level folders without reason
