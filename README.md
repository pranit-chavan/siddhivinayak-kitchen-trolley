# 🍳 Siddhivinayak Kitchen Trolley

<div align="center">

![Siddhivinayak Kitchen Trolley](public/favicon.png)

**A full-stack ERP & customer-facing web platform for a premium modular kitchen and customized furniture business.**

[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![Backend](https://img.shields.io/badge/Backend-NestJS%20%2B%20Prisma-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20(Neon)-316192?style=for-the-badge&logo=postgresql)](https://neon.tech)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Screenshots](#-screenshots)

---

## 🧾 Overview

**Siddhivinayak Kitchen Trolley** is a bespoke business management suite built for **Sachin Kuwar** — a craftsman specializing in modular kitchen design and custom furniture. The system consists of:

- **Public Portfolio Website** — Showcases past projects, captures customer inquiries.
- **Customer Project Tracker** — Lets customers view their live project progress via a unique link (`/track/SVK-XXXX`).
- **Internal Admin ERP** — A complete back-office system for managing projects, quotations, production, and finance.

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | SPA framework & lightning-fast build |
| TypeScript | Type safety across all components |
| Tailwind CSS | Utility-first styling with custom design tokens |
| Framer Motion | Fluid animations and page transitions |
| React Router DOM | Client-side routing (public vs admin) |
| Recharts | Financial P&L charts and analytics |
| React Three Fiber / Three.js | Interactive 3D kitchen design viewer |
| TanStack Query | Server-state management & API caching |
| React Hook Form + Zod | Form handling with schema validation |
| shadcn/ui + Radix UI | Accessible, headless UI component library |

### Backend
| Technology | Purpose |
|---|---|
| NestJS 11 | Modular, enterprise-grade REST API framework |
| Prisma 6 | Type-safe ORM with migration management |
| PostgreSQL (Neon) | Cloud serverless relational database |
| JWT (jsonwebtoken) | Admin authentication & session tokens |
| bcrypt | Secure password hashing |
| Swagger / OpenAPI | Auto-generated interactive API docs |
| class-validator | DTO-level request validation |

---

## ✨ Features

### 🌐 Public Layer
- **Project Portfolio** — Landing page with past work showcase and dynamic lead capture slide-over.
- **Live Project Tracker** (`/track/:projectId`) — Read-only customer dashboard showing:
  - 6-stage pulsing progress timeline
  - Live completion percentage
  - 3D design viewer (Three.js)

### 🔒 Admin ERP (`/admin/*`)
- **Authentication** — JWT-protected login with session guards.
- **Projects Manager** — Master table with auto-generated `SVK-YYYY-NNN` IDs, status filtering, and metric cards.
- **Production Engine** — Interactive 8-stage workshop tracker (Carcass → Lamination → Finishing → Delivery).
- **Quotation Builder** — Live math engine with GST (18%) calculation and WhatsApp deep-link delivery.
- **Finance Ledger** — Payment logging with Recharts-powered Profit & Loss visualization.
- **Cutting Optimizer** — 2D bin-packing algorithm that calculates plywood sheet usage and renders a visual cutting layout.
- **WhatsApp Engine** — One-click customer communication via formatted deep-links.

### 🔌 Backend API Modules
| Module | Endpoint Prefix | Description |
|---|---|---|
| Auth | `/api/v1/auth` | Login, token refresh |
| Projects | `/api/v1/projects` | CRUD for project records |
| Customers | `/api/v1/customers` | Customer management |
| Leads | `/api/v1/leads` | Lead capture and tracking |
| Quotations | `/api/v1/quotations` | Quote creation and line items |
| Finance | `/api/v1/finance` | Payment ledger entries |
| Production | `/api/v1/production` | Stage-wise production tracking |
| Designs | `/api/v1/designs` | Design file associations |
| Dashboard | `/api/v1/dashboard` | Aggregated KPI metrics |

---

## 📁 Project Structure

```
siddhivinayak-kitchen-trolley/
├── 📁 src/                        # Frontend React source
│   ├── 📁 components/             # Reusable UI components
│   ├── 📁 pages/
│   │   ├── 📁 portfolio/          # Public-facing website pages
│   │   └── 📁 erp/               # Admin ERP pages
│   ├── 📁 lib/                    # Utilities (whatsapp.ts, api client, etc.)
│   ├── 📁 data/                   # Static/mock data
│   ├── App.tsx                    # Root router configuration
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles & design tokens
│
├── 📁 public/                     # Static public assets
│   ├── 📁 images/                 # Project & portfolio images
│   ├── favicon.png
│   └── robots.txt
│
├── 📁 backend/                    # NestJS backend API
│   ├── 📁 src/
│   │   ├── 📁 auth/               # JWT auth module
│   │   ├── 📁 projects/           # Projects CRUD
│   │   ├── 📁 customers/          # Customer management
│   │   ├── 📁 leads/              # Lead tracking
│   │   ├── 📁 quotations/         # Quotation builder API
│   │   ├── 📁 finance/            # Payment ledger API
│   │   ├── 📁 production/         # Production stage tracker API
│   │   ├── 📁 designs/            # Design file API
│   │   ├── 📁 dashboard/          # KPI aggregation API
│   │   ├── 📁 common/             # Guards, decorators, interfaces
│   │   ├── 📁 config/             # App configuration
│   │   ├── 📁 prisma/             # Prisma service wrapper
│   │   └── main.ts                # NestJS bootstrap
│   ├── 📁 prisma/
│   │   ├── schema.prisma          # Full database schema
│   │   └── 📁 migrations/         # Prisma migration history
│   ├── .env.example               # Backend env template
│   └── package.json
│
├── index.html                     # Vite HTML entry point
├── vite.config.js                 # Vite & path alias config
├── tailwind.config.js             # Tailwind design tokens
├── .env.example                   # Frontend env template
├── FRONTEND_SUMMARY.md            # Architecture documentation
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and **npm** v9+
- **PostgreSQL** database (recommended: [Neon](https://neon.tech) — free serverless Postgres)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/pranit-chavan/snuggle-desk-studio.git
cd snuggle-desk-studio
```

### 2. Setup the Backend
```bash
cd backend

# Install dependencies
npm install

# Copy environment file and fill in your values
cp .env.example .env
# → Edit .env with your DATABASE_URL, DIRECT_URL, and JWT_SECRET

# Run database migrations
npm run prisma:migrate:deploy

# Generate Prisma client
npm run prisma:generate

# Start the backend dev server (runs on port 4000)
npm run start:dev
```

### 3. Setup the Frontend
```bash
# From project root
npm install

# Copy environment file
cp .env.example .env.local
# → Edit .env.local: VITE_API_BASE_URL=http://localhost:4000/api/v1

# Start the frontend dev server (runs on port 5173)
npm run dev
```

### 4. Access the App
| URL | Description |
|---|---|
| `http://localhost:5173` | Public portfolio website |
| `http://localhost:5173/admin` | Admin ERP login |
| `http://localhost:4000/api` | Swagger API documentation |

---

## 🔐 Environment Variables

### Frontend (`.env.local`)
```env
VITE_API_BASE_URL="http://localhost:4000/api/v1"
```

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://user:password@host-pooler.neon.tech/kitchen_trolley?sslmode=require&pgbouncer=true&channel_binding=require"
DIRECT_URL="postgresql://user:password@host.neon.tech/kitchen_trolley?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret-minimum-32-chars"
JWT_EXPIRES_IN="7d"
PORT="4000"
```

> ⚠️ **Never commit `.env` files.** They are excluded via `.gitignore`.

---

## 📖 API Documentation

Once the backend is running, visit **`http://localhost:4000/api`** for the full interactive Swagger UI.

All endpoints follow the pattern: `GET/POST/PATCH/DELETE /api/v1/<module>`

Authentication endpoints return a **JWT bearer token** — include it as:
```
Authorization: Bearer <token>
```

---

## 🗄 Database Schema

The PostgreSQL schema (managed with Prisma) includes the following core models:

- **`Admin`** — ERP user accounts with hashed passwords
- **`Customer`** — Customer records with contact details
- **`Lead`** — Pre-project inquiry tracking
- **`Project`** — Core project record (status, SVK-ID, linked customer)
- **`Quotation`** — Quote header with GST calculations
- **`QuotationItem`** — Individual line items within a quotation
- **`Payment`** — Finance ledger entries (advances, balances, dues)
- **`ProductionStage`** — 8-stage workshop progress tracker per project
- **`Design`** — Design file associations per project

Full schema: [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma)

---

## 👨‍💻 Developer

**Pranit Chavan** — Full-Stack Developer  
Built for **Sachin Kuwar / Siddhivinayak Kitchen Trolley**

---

## 📄 License

This project is proprietary software. All rights reserved.  
&copy; 2025 Siddhivinayak Kitchen Trolley. Built with ❤️ for Sachin Kuwar.
