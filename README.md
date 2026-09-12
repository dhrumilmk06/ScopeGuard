# Scope Guard Shield

Build the foundation for "ScopeGuard" — a SaaS that protects freelancers from scope creep.

STACK: React + Vite + Tailwind + shadcn/ui + React Router + TanStack Query + React Hook Form + Zod + Clerk (already connected). Database: Supabase. Money is ALWAYS stored as integer paise.

DESIGN SYSTEM: font Inter; colors: primary slate-900 (#0F172A), accent green-600 (#16A34A), background #F8FAFC, radius 8px, mobile-first. Clean, professional, minimal — like Stripe's dashboard, not playful.

Create the Supabase tables with RLS: projects (id, user_id, title, client_name, client_email, client_phone, share_token unique, is_public, status, created_at), deliverables (project_id, name, description, qty, unit_price, included_revisions, used_revisions), change_requests (project_id, deliverable_id nullable, title, description, price_impact, days_impact, status PENDING/APPROVED/DECLINED, created_by, approver_name, approver_email, approver_ip, approver_agent, approved_at, decline_reason), invoices (project_id, number unique, amount, status, razorpay_link_url, pdf_url, paid_at).

ROUTES: / (landing), /pricing, /login, /register handled by Clerk, /s/:token (PUBLIC scope page — no Clerk required, reads by share_token), and an authenticated app shell at /dashboard, /projects, /projects/new, /projects/:id, /change-requests, /change-requests/:id, /invoices, /settings with a left sidebar layout (logo, nav items, user avatar from Clerk).

RLS policy: all tables readable/writable only where user_id = auth clerk user id (via the users sync table). The /s/:token scope page reads via a Supabase RPC function bypassing RLS using the share_token only.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
