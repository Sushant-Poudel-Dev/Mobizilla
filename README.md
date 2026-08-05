# Mobizilla

A multi-tenant repair shop management platform built with Next.js 16, TypeScript, Tailwind CSS v4, and Supabase.

## Overview

Mobizilla provides a complete, end-to-end repair workflow in a single type-safe web application:

- Customer intake → Repair ticket creation → Parts/services management
- Inventory tracking with automatic stock reconciliation
- Invoice generation → Payment processing
- Multi-tenant architecture with database-level isolation (RLS)
- Role-based access control: owner > admin > technician > front_desk > staff

## Tech Stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Framework       | Next.js 16 (App Router)                        |
| Language        | TypeScript (strict mode)                       |
| Styling         | Tailwind CSS v4 (CSS-first config)             |
| Backend         | Supabase (Postgres, Auth, RLS, Edge Functions) |
| Forms           | react-hook-form + Zod                          |
| Validation      | Zod (shared schemas)                           |
| Data Fetching   | React Server Components + Server Actions       |
| Testing         | Vitest + React Testing Library                 |
| Linting         | ESLint + Prettier                              |
| Package Manager | npm                                            |

## Key Features

- **Database-level multi-tenancy**: Supabase RLS policies enforce data isolation at the database layer
- **Automatic inventory reconciliation**: PostgreSQL triggers adjust stock from purchases, repairs, adjustments, and reservations — no application-level race conditions
- **Complete repair lifecycle**: Customer intake → ticket → parts/services → invoice → payment in one type-safe workflow
- **Role-based access control**: Hierarchy enforced at both UI and database layers
- **Multi-currency support**: Currency defined at Organization level, formatted via Intl.NumberFormat
- **End-to-end type safety**: Database types generated from Supabase, strict TypeScript, Zod validation

## Getting Started

### Prerequisites

- Node.js ≥ 20.0.0
- npm
- Supabase project (local or cloud)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Development

```bash
# Start dev server
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format

# Build for production
npm run build

# Run tests
npm run test
```

## Database

The database schema, RLS policies, and onboarding Edge Function are fully implemented in Supabase. This repository contains only the application layer.

### Regenerate Types

After any schema change in Supabase:

```bash
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
```

## Roles & Permissions

| Role       | Capabilities                                           |
| ---------- | ------------------------------------------------------ |
| owner      | Full access, invite staff, manage organization         |
| admin      | Full access except organization settings, invite staff |
| technician | Repair tickets, parts/services, inventory read         |
| front_desk | Customers, tickets, invoices, payments                 |
| staff      | Limited read access per assignment                     |

## License

Private — internal use only.
