# ArtVerse - Premium Digital Art Marketplace

A high-end, gallery-grade art marketplace built with **Next.js 14**, **Supabase**, and **Tailwind CSS**.

## Features
- 🎨 **Gallery Aesthetics**: Premium dark mode design with glassmorphism and smooth animations.
- 🛍️ **E-commerce Core**: Browse, search, and view artworks.
- ⚡ **Real-time Backend**: Powered by Supabase for Auth, Database, and Storage.
- 🤖 **AI & AR Tools**: 
  - **Smart Pricing**: AI-driven price suggestions.
  - **AR View**: Visualize artwork in your own room.

## Getting Started

### 1. Prerequisites
- Node.js 18+
- A Supabase Project

### 2. Environment Setup
Create a `.env.local` file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Database Setup (Supabase)
This project uses SQL for database management.

1.  **Create Tables**:
    - Go to the **SQL Editor** in your Supabase Dashboard.
    - Run the contents of `supabase_schema.sql`.
    - This creates `profiles`, `artworks`, and sets up Security Policies (RLS).

2.  **Seed Data**:
    - To populate the app with sample artists and artworks, run the contents of `supabase_seed.sql` in the SQL Editor.

### 4. Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Language**: TypeScript
