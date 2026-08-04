# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4, Supabase (Postgres + RLS + Auth + Edge Functions), react-hook-form + Zod, react 19, clsx + tailwind-merge

## Users

Primary: Repair shop owners/managers — manage business operations, staff, inventory, finances, and make data-driven decisions.
Secondary: Front desk staff — customer intake, ticket creation, invoicing, customer communication.
Tertiary: Technicians — hands-on repair work, parts management, status updates, time tracking.
All users operate within a multi-tenant, role-based access control system with roles: owner > admin > technician > front_desk > staff (one role per user per organization).

## Product Purpose

A multi-tenant repair shop management platform that provides a complete, end-to-end repair workflow in a single type-safe web application: customer intake → repair ticket creation → parts/services management → inventory tracking → invoice generation → payment processing. The platform differentiates through:

1. **Multi-tenant architecture with database-level isolation** — Supabase RLS policies enforce data isolation at the database layer, not just application layer.
2. **Real-time inventory with automatic stock tracking** — Database triggers automatically adjust inventory stock from purchases, repair parts consumption, stock adjustments, and reservations — no application-level race conditions.
3. **Complete repair lifecycle in one flow** — Customer intake → ticket → parts/services → invoice → payment, all in a single type-safe workflow.
4. **Role-based access control with permission hierarchy** — owner > admin > technician > front_desk > staff, enforced at both UI and database (RLS) layers.
5. **Multi-currency support** — Currency defined at Organization level, formatted using Intl.NumberFormat.
5. **Type-safe throughout** — Database types generated from Supabase, strict TypeScript, Zod validation, end-to-end type safety from database to UI.

Success means: repair shops can run their entire operation in one app with zero data leakage between tenants, real-time inventory accuracy, and workflow efficiency.

## Positioning

The product mechanism a neighboring product could not truthfully copy: **Database-level multi-tenancy with automatic inventory reconciliation via PostgreSQL triggers**. Most competitors implement multi-tenancy at the application layer (vulnerable to bugs) and require manual inventory adjustments. Mobizilla's stock tracking is a side effect of the data model itself — impossible to corrupt at the application layer.

## Operating Context

Workflows:
- **Customer intake** — Front desk creates customer record, optionally creates repair ticket
- **Repair workflow** — Technician assigned, status updated (new → in progress → completed), parts consumed from inventory, services added
- **Inventory management** — Purchases increase stock, repairs consume stock, adjustments correct stock, reservations hold stock
- **Invoicing** — Auto-generated from completed repair tickets (parts + services), manual line items supported
- **Payments** — Recorded against invoices, payment status auto-recalculates (unpaid → partial → paid)
- **Purchasing** — Purchase orders to suppliers, receipt updates inventory stock
- **Reporting** — Dashboard with stats (open tickets, in progress, completed, revenue, pending invoices, low stock)

Environments: Web browser (desktop primary, mobile responsive for dashboard), works offline-capable via Supabase realtime.

## Capabilities and Constraints

Confirmed functionality:
- Multi-tenant auth with Supabase Auth (email/password, magic link)
- Full CRUD for: Customers, Inventory items, Suppliers, Repair tickets, Invoices, Purchases, Payments, Staff
- Inventory: items, categories, brands, conditions, device model compatibility, stock per branch
- Repair tickets: create, assign technician, update status, add parts/services, view totals
- Invoicing: auto-generate from ticket, manual line items, tax/discount, payment recording
- Payments: multiple methods, auto-recalculate invoice status (unpaid/partial/paid)
- Purchases: supplier, branch, line items with condition, auto stock receipt
- Staff management: invite by email, role assignment, branch assignment
- Dashboard: stats cards, activity feed, quick actions (role-aware)

Technical constraints:
- Next.js 16 App Router (not Pages Router), Server Components by default
- Server Actions for mutations, Server Components for data fetching
- Supabase RLS for all data access — no manual auth checks in queries
- Database triggers manage: inventory_stock, inventory_movements, audit columns, payment_status auto-recalc
- Never write directly to inventory_stock or inventory_movements — triggers handle it
- Created/performed/received_by_user_id set server-side by triggers
- SUPABASE_SERVICE_ROLE_KEY only in Edge Functions/server-only code
- Two Supabase clients: browser (anon key) and server (cookie-based via @supabase/ssr)
- Snake_case in database, camelCase in application — conversion in data-access layer only
- Currency stored at Organization level, never per-transaction
- No TanStack Query by default — Server Components + Server Actions preferred

Explicitly undecided:
- Reporting/analytics beyond dashboard stats
- Email/SMS notifications
- Mobile app (native or PWA)
- Multi-location reporting
- Customer portal (self-service)

## Brand Commitments

Name: **Mobizilla** (established in codebase)
Voice: Professional, technical, trustworthy, efficient
Visual identity: Light theme, Helvetica Neue, blue accent (#0066cc), clean industrial aesthetic
Logo: Custom SVG icon (box/package iconography) with "Mobizilla" wordmark
Commitment: Type-safe, production-grade, no half-measures — "no features beyond what was asked"

## Evidence on Hand

Real content:
- Full Supabase schema with 40+ tables (organizations, branches, users, customers, inventory_items, inventory_stock, repair_tickets, invoices, payments, purchases, suppliers, staff, etc.)
- Complete RLS policies for all tables
- Database triggers for inventory, audit, payment status
- Edge Function for onboarding (onboard_organization)
- 20+ dashboard pages implemented (list, detail, create for all domains)
- Component library: Button, Card, Input, Select, Table, Badge, StatCard, ActivityFeed, Avatar, DropdownMenu, UserMenu, Sidebar, DashboardHeader
- Design system: Light theme, Helvetica Neue, blue accent, CSS-first Tailwind v4 config

Absences future work must not fabricate:
- No customer testimonials or case studies
- No pricing/licensing pages
- No marketing landing page
- No fabricated metrics or benchmarks

## Product Principles

1. **Type safety as a feature, not afterthought** — Schema changes propagate from database to UI; if it compiles, it's likely correct.
2. **Database as source of truth** — Triggers enforce invariants; application code never second-guesses the database.
3. **Server-first, client only when necessary** — Server Components by default; client components only for interactivity.
4. **Multi-tenancy at the database layer** — RLS policies are the security boundary; application code never manually filters by organization_id.
5. **No speculative features** — Every feature traces to a real user job; no "flexibility" or "configurability" that wasn't requested.

## Accessibility & Inclusion

- Semantic HTML (landmarks, headings, tables with proper headers)
- Keyboard navigation for all interactive elements
- Focus visible states on all focusable elements
- Color contrast meets WCAG AA (verified in design system)
- Form labels associated with inputs
- ARIA labels on icon-only buttons
- Responsive design (mobile drawer sidebar, stacked tables on mobile)