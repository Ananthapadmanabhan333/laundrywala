# 🧺 MANODROP — Intelligent Smart Garment Care & Premium Laundry OS

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000.svg?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=for-the-badge&logo=mongodb)](https://www.mongodb.com)

> **MANODROP ("ALL YOU DESIRE")** is an ultra-premium, enterprise-grade Intelligent Garment Care, Professional Laundry, and Eco-Dry Cleaning OS. Built with Next.js 15, Tailwind CSS, Framer Motion, and Zustand, it features real-time telemetry tracking, secure logistics, and bespoke couture treatment selectors.

---

## 🎨 Brand Identity & Design System

The application's theme and visuals are built strictly around the **MANODROP** brand logo:
*   **Primary Deep Navy Blue (`#0C2340`)**: Establishing a sleek, premium, and authoritative background layer.
*   **Active Emerald Green (`#10B981`)**: Highlights active badges, primary interactive widgets, buttons, and telemetry logs.
*   **Sage Mint Accent (`#D1FAE5`)**: Soft, clean background tints for banners and alert lists.
*   **Typography**: Outfitted with modern fonts (`Outfit` and `Plus Jakarta Sans`) to deliver a state-of-the-art UI experience.

---

## 🚀 Key Premium Features

### 1. Bespoke Couture Booking & Smart Cart
- **Dedicated Couture Segments**: Tailored categories for **Men's Couture**, **Women's Couture**, **Daily Essentials**, and **Household Linens**.
- **Instant Quantity Badges**: Garment cards update immediately with a numerical counter badge showing items added to the cart.
- **Zustand Local Storage Persistence**: State is automatically persisted in `localStorage` to prevent cart loss on page reloads or routing.
- **Dynamic Pricing Multipliers**: Automatic calculation of costs based on selected care treatment levels.

### 2. Amazon-style Unified Checkout Flow (`/dashboard/book/review`)
- **Itemized Verification Summary**: Live calculations of subtotal, tax (5% GST), courier dispatch fee (₹50), promotional discount, and grand total.
- **Promotional Coupons**: Real-time validation of coupon codes (e.g., `WELCOME10`) using `/api/coupons/validate`.
- **Inline Address Manager**: Select from saved locations or dynamically add new addresses (Home, Work, Other) inline during checkout without leaving the page.
- **Flexible Timetable Schedulers**: Select preferred dates and time slots for both doorstep collection and final return delivery.

### 3. payment & Verification Integrations
- **Razorpay Secure Checkout**: Integrated with online payment overlays. Supports sandbox fallbacks to simulate signature verification during local development.
- **Cash on Delivery (COD)**: Option to finalize order instantly and pay at delivery.
- **Secure Timelines**: Embedded vertical timelines showing chronological progress (Order Placed, Pickup Assigned, Picked Up, Facility Care, Out for Delivery, Delivered) synced from MongoDB order documents.

---

## 🏗️ Technical Stack

### Frontend & Client
*   **Next.js 15 App Router** - Serverless hybrid page rendering and path routing.
*   **TypeScript** - 100% strict type safety across the entire schema.
*   **Tailwind CSS** - Modern custom themes and utility classes.
*   **Zustand** - Persistent state management stores.
*   **Framer Motion** - Micro-animations and page transitions.
*   **Lucide React** - High-fidelity icons.

### Backend & Database
*   **Next.js API Routes** - Clean serverless handlers.
*   **MongoDB Atlas** & **Mongoose** - Advanced document database and models.
*   **Firebase Authentication** - Secure phone OTP verification.
*   **Razorpay Gateway** - Robust payment integrations.

---

## 🔧 Installation & Verification

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/Ananthapadmanabhan333/laundrywala.git
cd laundrywala
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file at the root:
```env
NEXT_PUBLIC_APP_NAME=MANODROP
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=...
JWT_SECRET=...
```

### 3. Initialize & Seed Database
```bash
npm run db:seed
```

### 4. Build & Verify Clean Compilation
Verify that all types and modules build successfully with zero errors:
```bash
npm run type-check   # Runs tsc --noEmit
npm run build        # Generates optimized production package
```

### 5. Launch Development Environment
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📁 Key File Map
```
laundrywala/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Rebranded Landing Page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx    # Live Sidebar & Pulsing Badges
│   │   │   ├── page.tsx      # Premium Garment Telemetry Panel
│   │   │   ├── book/         # Bespoke Couture Selector
│   │   │   ├── orders/       # Active Timeline Tracking
│   │   │   └── settings/     # Security Control Center
│   │   ├── admin/            # Admin Panel
│   │   └── agent/            # Agent Routing Panel
│   ├── components/
│   │   ├── Logo.tsx          # Official Premium SVG Logo
│   │   └── ui/               # Tailored UI Widgets
│   ├── models/               # Database Schemas
│   └── store/                # Zustand State Stores
├── next.config.ts            # Production Bundle Configuration
└── tailwind.config.ts        # Custom Theme Specifications
```

---

Built by Ananthapadmanabhan 
