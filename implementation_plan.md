# Implementation Plan - Art Marketplace

# Goal Description
Build a premium, high-performance Art Marketplace where artists can sell work and a Super Admin manages the platform. The platform will feature "View in Room" (AR) and AI-assisted tools to stand out.

## User Review Required
> [!IMPORTANT]
> **AR & AI Strategy**: 
> *   **AR**: We will build a **Web-based "View in Room"** feature. This does *not* require users to download an app. They simply upload a photo of their wall, and our tool overlays the art at the correct scale. This is the most accessible "AR" for web.
> *   **AI**: We will focus on **Seller Tools**.
>     1.  *AI Tagging*: Auto-generate tags and descriptions from the art image (using Vision AI models).
>     2.  *Smart Pricing*: A logic-based estimator suggesting prices based on dimensions and medium.

## Proposed Changes

### Tech Stack
*   **Framework**: Next.js 14+ (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS + Framer Motion (for premium feel)
*   **Backend**: Next.js Server Actions + API Routes
*   **Database**: PostgreSQL (Supabase) – best for relational data (orders, commissions)
*   **Storage**: Supabase Storage / AWS S3 (for Image Artifacts)
*   **Auth**: Clerk or Supabase Auth (Multi-role: Admin, Seller, Buyer)
*   **Payments**: Stripe Connect (Marketplace split payments)

### Core Features Breakdown

#### 1. Core Platform (Foundation)
*   [ ] **Authentication System**:
    *   Use **Supabase Auth** (Email/Password + Google OAuth).
    *   Middleware to protect `/sell` and `/admin` routes.
*   [ ] **Database Schema (Supabase/PostgreSQL)**:
    *   `profiles`: Users (Buyer/Seller role).
    *   `artworks`: Title, Price, ImageURL, Dimensions, Tags, ArtistID.
    *   `collections`: Grouping artworks.
    *   `orders`: Transaction history.
*   [ ] **Backend Logic (Server Actions)**:
    *   `getArtworks()`: Fetch for Home/Explore (support filters).
    *   `createArtwork()`: Handle file upload to Supabase Storage + DB Insertion.
    *   `addToCart()` / `checkout()`: Stripe session creation.

#### 2. Seller Hub (Artist)
*   [ ] **Onboarding**: "Become a Seller" flow.
*   [ ] **Upload Wizard**: Drag & drop art.
    *   *AI Integration*: "Analyze Image" button to auto-fill description/tags.
*   [ ] **Dashboard**: Sales graphs, Orders list (Pending/Shipped).

#### 3. Super Admin Panel
*   [ ] **Commission Manager**: Set global fee % (e.g., 15%).
*   [ ] **Dispute Resolution**: Refund/Cancel orders.
*   [ ] **Curation**: Select specific items to appear on the Homepage.

#### 4. The "Wow" Features
*   [x] **AR "View In Room"** (Frontend Completed)
*   [ ] **AI Pricing Estimator** (Logic Completed, Needs DB connection)

## Verification Plan

### Automated Tests
*   `npm run build`: Ensure generic build success.
*   Unit tests for commission calculation functions.

### Manual Verification
*   **AR Test**: Upload a 50x50cm painting, upload a room photo, verify the overlay looks proportional.
*   **AI Test**: Upload a cryptic abstract image, verify the tagging system suggests "abstract", "colorful", etc.
*   **Purchase Flow**: Create 2 accounts (Seller, Buyer). Buy an item. Verify Seller sees the order and Admin sees the commission.
