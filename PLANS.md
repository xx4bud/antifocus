# PLANS.md — Antifocus Enterprise MVP Build Roadmap

> Enterprise-grade build roadmap for production-ready multi-tenant SaaS. Each phase delivers vertical slices across the stack with clear production criteria.

---

## Current Build Status

| Area | Status | Notes |
|------|--------|-------|
| Auth UI (sign-in, sign-up) | ✅ Done | Pages, forms, Better Auth wired |
| Better Auth configuration | ✅ Done | Plugins, permissions, hooks |
| tRPC scaffold | ✅ Done | Context, handler, basic routers (orgs, users) |
| UI components (shadcn) | ✅ Done | Full component set installed |
| Email templates | ✅ Done | OTP, invite, verify, reset |
| i18n setup | ✅ Done | next-intl, ID + EN message files |
| Inngest / Redis / UploadThing clients | ✅ Done | Client instances wired |
| Utility functions | ✅ Done | money, date, id, error, etc. |
| DB schema: auth + org | ✅ Done | `auth.ts`, `org.ts` in Drizzle |
| DB schema: core / taxonomy / catalog | ✅ Done | Tasks T-01, T-02 |
| DB schema: finance / supply / order | ✅ Done | Tasks T-01, T-02, T-03 |
| DB schema: production / marketing | ✅ Done | Task T-03 |

---

## Build Principles

1. **Vertical Slices**: Each phase delivers end-to-end functionality across all layers
2. **Production-First**: All code passes CI/CD, type-check, and security gates before merging
3. **Multi-tenant by Design**: Every query enforces `organization_id` filtering
4. **Scalable Infrastructure**: Stateful services decoupled from app layer
5. **Observable**: Logging, metrics, and tracing configured from Day 1
6. **Gradual Rollouts**: Feature flags enabled for all new functionality

---

## Phase 0 — Foundation & Infrastructure (Weeks 1-2)

> Establish production-grade infrastructure, CI/CD, and development environment

### Objectives

- Set up robust CI/CD pipeline with automated testing and deployment
- Configure monitoring, logging, and error tracking
- Establish development environment standards
- Implement security and compliance safeguards

### Tasks

| ID | Task | Deliverable |
|----|------|-------------|
| 0.1 | Configure GitHub Actions CI/CD | Build, test, lint, and preview deploys on every PR |
| 0.2 | Set up PostHog analytics | Event tracking, user identification, funnel analysis |
| 0.3 | Configure Sentry integration | Error tracking, performance monitoring, source maps |
| 0.4 | Implement structured logging | Winston/Pino with correlation IDs |
| 0.5 | Set up Vercel Deploy Hooks | Automatic preview deploys on PR |
| 0.6 | Configure environment validation | Zod schema for all `.env` variables |
| 0.7 | Set up local development tooling | Docker for local database, Redis, Inngest |

### Success Criteria

- ✅ All branches have preview deploys
- ✅ CI fails on lint/type errors
- ✅ All production errors appear in Sentry
- ✅ Analytics events flow to PostHog
- ✅ `.env` validation catches missing keys at startup

---

## Phase 1 — Core Platform (Weeks 2-3)

> Build multi-tenancy foundation, authentication, and core infrastructure

### Objectives

- Implement robust multi-tenant architecture
- Create core services (files, sequences, settings)
- Establish tRPC middleware and security patterns

### Tasks

| ID | Task | Deliverable |
|----|------|-------------|
| 1.1 | Complete Drizzle schema | All 10 domains migrated from Prisma blueprints |
| 1.2 | Push schema to Neon | `pnpm db:push` succeeds with 60+ tables |
| 1.3 | Implement tRPC middleware stack | `protectedProcedure`, `orgProcedure`, `branchProcedure` |
| 1.4 | Core tRPC routers | Settings, sequences, files, notifications |
| 1.5 | Organization service layer | Org CRUD, branches, members, customers, suppliers |
| 1.6 | Audit logging middleware | Automatic audit trail for all mutations |

### Success Criteria

- ✅ All queries enforce `organization_id` scope
- ✅ Branch switching works without database roundtrips
- ✅ All tRPC procedures are type-safe
- ✅ Audit log captures every change with actor context

---

## Phase 2 — Product & Catalog (Weeks 3-5)

> Build product catalog with design configuration capabilities

### Objectives

- Enable staff to create and manage products with variants
- Implement design area system for print-on-demand
- Create pricing and cost management system

### Tasks

| ID | Task | Deliverable |
|----|------|-------------|
| 2.1 | Taxonomy management | Categories, attributes, tags, collections |
| 2.2 | Product CRUD | Create, edit, list, status transitions |
| 2.3 | Variant matrix generator | Cartesian product of attribute options |
| 2.4 | Design areas | Define print zones with dimensions |
| 2.5 | Product design system | Upload and assign design templates |
| 2.6 | Pricing & cost lists | Price overrides, supplier cost tracking |
| 2.7 | Image upload integration | UploadThing → files table → product images |

### Success Criteria

- ✅ Staff can create a product with 5+ variants
- ✅ Design configurator shows live preview on product mockup
- ✅ Price recalculation works with discounts and taxes
- ✅ All images stored in centralized files table

---

## Phase 3 — Order Management (Weeks 5-7)

> Complete end-to-end order lifecycle from storefront to ERP

### Objectives

- Implement storefront checkout flow
- Build ERP order processing workflow
- Create fulfillment and return management

### Tasks

| ID | Task | Deliverable |
|----|------|-------------|
| 3.1 | Order channel management | POS, web, marketplace integration config |
| 3.2 | POS session management | Cash drawer opening/closing with balance tracking |
| 3.3 | Cart implementation | Guest + logged-in cart with Redis sync |
| 3.4 | Multi-step checkout | Address → shipping → payment → confirmation |
| 3.5 | Order creation API | Auto-generate order number, reserve inventory |
| 3.6 | Order status transitions | Pending → confirmed → processing → shipped → delivered |
| 3.7 | Fulfillment workflow | Partial fulfillment, tracking numbers, shipping labels |
| 3.8 | Return management | Return initiation, receipt processing, refunds |

### Success Criteria

- ✅ Customer can browse → add to cart → checkout → receive order number
- ✅ Staff can confirm orders and create fulfillments
- ✅ Partial fulfillment updates order status correctly
- ✅ Returns create inventory adjustments

---

## Phase 4 — Operational Excellence (Weeks 7-9)

> Inventory, production, and supply chain management

### Objectives

- Implement real-time inventory tracking
- Build production order management
- Streamline purchase order workflow

### Tasks

| ID | Task | Deliverable |
|----|------|-------------|
| 4.1 | Inventory management | Stock levels, adjustments, low-stock alerts |
| 4.2 | Inventory movements | Ledger for all stock changes |
| 4.3 | Inventory transfers | Cross-branch transfers with tracking |
| 4.4 | Purchase order workflow | Draft → submit → approve → receive → bill |
| 4.5 | BOM (Bill of Materials) | Material recipes for production |
| 4.6 | Production orders | Create from sales order or manual |
| 4.7 | Production tasks | Task assignment, status updates, kanban view |
| 4.8 | Shipping configuration | Couriers, methods, rate calculation |

### Success Criteria

- ✅ Real-time stock levels update on every transaction
- ✅ Purchase order receive flow creates inventory movements
- ✅ Production order consumes BOM materials automatically
- ✅ Inventory transfers move stock between branches

---

## Phase 5 — Finance (Weeks 9-10)

> Comprehensive financial management system

### Objectives

- Manage accounts receivable and payable
- Implement payment processing
- Track expenses and cash flow

### Tasks

| ID | Task | Deliverable |
|----|------|-------------|
| 5.1 | Payment method management | Cash, bank transfer, ewallet, QRIS |
| 5.2 | Invoice management | Auto-create on order delivery, status tracking |
| 5.3 | Supplier bill management | Receive goods, match invoices, payment |
| 5.4 | Cashbook (payments) | Central ledger for all money movement |
| 5.5 | Expense management | Categorize, approve, reimbursable tracking |
| 5.6 | Tax rate configuration | PPN 12%, product-specific rates |

### Success Criteria

- ✅ Invoice auto-creates when order is delivered
- ✅ Payment application updates invoice status and amounts
- ✅ Cashbook shows running balance per payment method
- ✅ Expense reports group by category and date range

---

## Phase 6 — Marketing & Engagement (Weeks 10-11)

> Customer acquisition, retention, and support systems

### Objectives

- Run promotions and discount campaigns
- Manage customer reviews and feedback
- Implement help desk ticketing

### Tasks

| ID | Task | Deliverable |
|----|------|-------------|
| 6.1 | Promotion engine | Percentage, fixed, buy-x-get-y, free shipping |
| 6.2 | Voucher system | Generate codes, track usage, limit constraints |
| 6.3 | Banner management | Hero, sidebar, popup banners with scheduling |
| 6.4 | Review moderation | Approve/reject, reply to customers |
| 6.5 | Blog/Post CMS | Publish articles, categorize, SEO metadata |
| 6.6 | Support tickets | Open, assign, message, resolve workflow |
| 6.7 | Customer communication | Order confirmations, shipping updates |

### Success Criteria

- ✅ Promotion validates eligibility correctly (date, usage limits, min order)
- ✅ Voucher codes are unique and trackable
- ✅ Reviews appear on product pages after approval
- ✅ Ticket resolution workflow functions end-to-end

---

## Phase 7 — Production Readiness (Weeks 11-12)

> Comprehensive testing, security hardening, and scaling preparation

### Objectives

- Ensure zero critical bugs before launch
- Implement security best practices
- Optimize for performance and scale

### Tasks

| ID | Task | Deliverable |
|----|------|-------------|
| 7.1 | Security audit | SQL injection, XSS, CSRF, RBAC verification |
| 7.2 | End-to-end testing | Playwright tests for critical user flows |
| 7.3 | Performance optimization | Query optimization, caching, bundle size |
| 7.4 | Database indexing | Add missing indexes based on query patterns |
| 7.5 | Connection pooling | Verify Neon connection settings |
| 7.6 | Redis caching | Session cache, query result cache |
| 7.7 | Backup verification | Test Neon point-in-time recovery |
| 7.8 | Documentation | API docs, admin guide, user manual |

### Success Criteria

- ✅ All critical paths have E2E test coverage
- ✅ Security scan finds no critical/high issues
- ✅ P95 latency under 500ms for API endpoints
- ✅ Database queries use indexes (explain analyze verified)

---

## Phase 8 — Deployment & Beyond (Week 12+)

> Production launch and continuous improvement

### Objectives

- Launch to production with minimal disruption
- Establish monitoring and alerting
- Plan subsequent iterations

### Tasks

| ID | Task | Deliverable |
|----|------|-------------|
| 8.1 | Staging deployment | Mirror production environment |
| 8.2 | Production deployment | Blue-green or canary release |
| 8.3 | Monitoring dashboard | Vercel analytics, Sentry alerts, PostHog funnels |
| 8.4 | Alert configuration | Critical errors, performance degradation |
| 8.5 | Post-launch review | 24-hour stability check |
| 8.6 | Post-MVP backlog | Feature flags for deferred items |

### Success Criteria

- ✅ 99.9% uptime in first week
- ✅ Zero critical bugs in production
- ✅ All alerts firing correctly
- ✅ Documentation complete and accessible

---

## Key Decision Points

| Milestone | Go/No-Go Criteria | Date Target |
|-----------|-------------------|-------------|
| M0: Core Platform | All schema migrated, tRPC stable | Week 3 |
| M1: Order System | Checkout → order → fulfillment complete | Week 7 |
| M2: Production Ready | Security audit passed, E2E tests green | Week 12 |
| M3: Launch | All core ERP + storefront features working | Week 13 |

---

## Notes

- This plan follows the [AGENTS.md](./AGENTS.md) conventions
- Every phase must pass CI/CD before proceeding
- Feature flags enable gradual rollouts and kill switches
- Multi-tenancy is enforced at database query layer
- All monetary values use `numeric(15,2)` and `dinero.js`
- Indonesian locale (ID) is primary, EN secondary via `next-intl`
