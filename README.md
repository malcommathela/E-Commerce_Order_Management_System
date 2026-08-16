# E-Commerce Order Management System

A full-stack order management platform built as a capstone project. Handles the complete order lifecycle—from internal staff authentication and customer registration to product cataloging, inventory deduction, order fulfillment, and payment tracking.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Axios, React Router 6 |
| **Backend** | Node.js 20, Express 4, oracledb |
| **Database** | Oracle Database 21c XE (Docker) |
| **Auth** | JWT (httpOnly cookies), bcrypt, nodemailer, cookie-parser |
| **DevOps** | Docker Compose |

## Core Features

### Order Management
- **Customer & Supplier Management** — CRUD with contact details and addresses
- **Product Catalog** — Category hierarchy, SKU tracking, supplier linkage
- **Inventory Control** — Real-time stock levels with automatic deduction via Oracle trigger
- **Order Lifecycle** — PENDING → CONFIRMED → SHIPPED → DELIVERED → CANCELLED
- **Payment Tracking** — Per-order payments with method & status tracking

### Authentication & Authorization
- **Staff Authentication** — Email/password login with httpOnly session cookies
- **Email Verification** — 6-digit code sent via Gmail SMTP on signup
- **Role-Based Access Control (RBAC)** — Three staff tiers:
  - `ADMIN` — Full system access, user management
  - `MANAGER` — Create, read, update, delete all business entities
  - `STAFF` — Read all data, create/update orders & order items
- **Protected API** — All entity routes require valid auth + appropriate role
- **Protected Frontend** — Unauthenticated users are redirected to login; authenticated users see role-based UI

### Frontend
- **Dashboard** — Live KPIs (orders, revenue, products, low stock, customers)
- **Auth Pages** — Login, signup, and email verification with responsive split-layout design
- **CRUD Pages** — 8 entity modules with search, sort, create, edit, delete
- **Responsive Layout** — Dark sidebar, status indicators, modal forms
- **Data Normalization** — Oracle UPPERCASE keys auto-converted to camelCase

## Database Schema

9 entities in 3NF:

| Table | Purpose |
|-------|---------|
| `USERS` | Internal staff auth (admin/manager/staff) |
| `CUSTOMER` | End-customer profiles |
| `SUPPLIER` | Product vendors |
| `CATEGORY` | Product taxonomy |
| `PRODUCT` | Catalog items with pricing & stock |
| `INVENTORY` | Warehouse stock levels |
| `ORDERS` | Customer purchase orders |
| `ORDER_ITEM` | Line items per order |
| `PAYMENT` | Transaction records |

### Key Constraints
- `trg_update_inventory` — Auto-deducts stock on `ORDER_ITEM` insert
- `trg_users_updated_at` — Auto-updates user `updated_at` timestamp
- Check constraints on `price >= 0`, `quantity > 0`, `status` enums
- Foreign keys with `ON DELETE CASCADE` where appropriate

## API Reference

### Auth Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/signup` | Public | Register new staff account |
| `POST` | `/api/auth/verify-email` | Public | Confirm 6-digit email code |
| `POST` | `/api/auth/resend-email` | Public | Resend verification code (1-min cooldown) |
| `POST` | `/api/auth/login` | Public | Login, sets `oms_session` httpOnly cookie |
| `POST` | `/api/auth/logout` | Public | Clear session cookie |
| `GET` | `/api/auth/me` | Cookie | Get current user profile |

### Entity Endpoints (all require auth cookie)
| Resource | Base | Create | Read | Update | Delete |
|----------|------|--------|------|--------|--------|
| Customers | `/api/customers` | ADMIN, MANAGER | ALL | ADMIN, MANAGER | ADMIN, MANAGER |
| Suppliers | `/api/suppliers` | ADMIN, MANAGER | ALL | ADMIN, MANAGER | ADMIN, MANAGER |
| Categories | `/api/categories` | ADMIN, MANAGER | ALL | ADMIN, MANAGER | ADMIN, MANAGER |
| Products | `/api/products` | ADMIN, MANAGER | ALL | ADMIN, MANAGER | ADMIN, MANAGER |
| Inventory | `/api/inventory` | ADMIN, MANAGER | ALL | ADMIN, MANAGER | ADMIN, MANAGER |
| Orders | `/api/orders` | ALL | ALL | ALL | ADMIN, MANAGER |
| Order Items | `/api/items` | ALL | ALL | ADMIN, MANAGER | ADMIN, MANAGER |
| Payments | `/api/payments` | ADMIN, MANAGER | ALL | ADMIN, MANAGER | ADMIN, MANAGER |

> `ALL` = ADMIN, MANAGER, STAFF

## File Structure

```
E-Commerce Order Management System/
├── backend/
│   ├── scripts/
│   │   ├── schema.sql          # Oracle DDL (9 tables + triggers + indexes)
│   │   ├── schema.js           # Schema runner
│   │   ├── seed.sql            # Sample data + seeded admin user
│   │   └── seed.js             # Seed runner
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # Oracle connection pool
│   │   ├── controllers/
│   │   │   ├── auth.js         # Login, signup, verify, resend, logout, me
│   │   │   ├── category.js
│   │   │   ├── customer.js
│   │   │   ├── inventory.js
│   │   │   ├── item.js
│   │   │   ├── order.js
│   │   │   ├── payment.js
│   │   │   ├── product.js
│   │   │   └── supplier.js
│   │   ├── middleware/
│   │   │   └── auth.js         # requireAuth + requireRole
│   │   ├── models/
│   │   │   ├── category.js
│   │   │   ├── customer.js
│   │   │   ├── inventory.js
│   │   │   ├── Item.js
│   │   │   ├── order.js
│   │   │   ├── payment.js
│   │   │   ├── product.js
│   │   │   ├── supplier.js
│   │   │   └── user.js         # Oracle DAL for USERS table
│   │   ├── routes/
│   │   │   ├── auth.js         # Auth routes
│   │   │   ├── category.js     # Protected routes
│   │   │   ├── customer.js     # Protected routes
│   │   │   ├── inventory.js    # Protected routes
│   │   │   ├── item.js         # Protected routes
│   │   │   ├── order.js        # Protected routes
│   │   │   ├── payment.js      # Protected routes
│   │   │   ├── product.js      # Protected routes
│   │   │   └── supplier.js     # Protected routes
│   │   ├── utils/
│   │   │   └── email.js        # Nodemailer Gmail transport
│   │   └── index.js            # Express app, CORS, cookie-parser, auth mount
│   ├── .env
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiService.js   # Axios instance + 40+ endpoints
│   │   │   └── auth.js         # Auth API wrappers
│   │   ├── components/
│   │   │   ├── DataTable.jsx   # Search, sort, actions
│   │   │   ├── Header.jsx      # Status indicator
│   │   │   ├── Layout.jsx      # Sidebar + content wrapper
│   │   │   ├── Modal.jsx       # Create/Edit dialogs
│   │   │   ├── ProtectedRoute.jsx # Route guard (auth + role check)
│   │   │   ├── Sidebar.jsx     # Navigation + user info + logout
│   │   │   └── StatCard.jsx    # KPI cards
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state (user, login, logout)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Live KPIs + recent orders
│   │   │   ├── Categories.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Login.jsx       # Split-layout login page
│   │   │   ├── OrderItems.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Payments.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Signup.jsx      # Split-layout signup page
│   │   │   ├── Suppliers.jsx
│   │   │   └── VerifyEmail.jsx # 6-digit code verification page
│   │   ├── styles/
│   │   │   ├── Auth.css        # Shared auth page styles
│   │   │   └── global.css
│   │   ├── App.jsx             # Router + AuthProvider + route protection
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml          # Oracle XE 21c
├── .gitignore
├── package.json
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 20+
- Docker Desktop
- Gmail account (for email verification)

### 1. Start Oracle Database
```bash
docker-compose up -d
```

> If port 1521 is occupied by a local Oracle listener, either stop the local service (`Stop-Process -Id (Get-NetTCPConnection -LocalPort 1521).OwningProcess -Force`) or change the port mapping in `docker-compose.yml` to `"1522:1521"` and update `DB_CONNECTION_STRING` accordingly.

### 2. Initialize Database
```bash
cd backend
node scripts/schema.js   # Creates all 9 tables + triggers + indexes
node scripts/seed.js     # Inserts sample data + pre-verified admin user
```

### 3. Configure Environment

**`backend/.env`**
```env
PORT=3001
NODE_ENV=development
DB_USER=ecommerce_user
DB_PASSWORD=ecommerce_pass
DB_CONNECTION_STRING=localhost:1521/XEPDB1
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:3001/api
```

### 4. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

> The backend requires `jsonwebtoken`, `bcrypt`, `cookie-parser`, and `nodemailer`. If any are missing, run:
> ```bash
> cd backend && npm install jsonwebtoken bcrypt cookie-parser nodemailer
> ```

### 5. Start Backend
```bash
cd backend
npm run dev
```

### 6. Start Frontend
```bash
cd frontend
npm run dev
```

### 7. Open App
Navigate to `http://localhost:5173`

You will be redirected to `/login`. Use the seeded admin account below, or sign up as a new staff member.

## Seeded Admin Account

The seed script creates a pre-verified admin user so you can log in immediately without email setup:

| Field | Value                |
|-------|----------------------|
| **Email** | `root@gmail.com`     |
| **Password** | `admin123`           |
| **Username** | `admin`              |
| **Role** | `ADMIN`              |
| **Status** | Pre-verified, active |

> In production, replace this with a real email address and rotate the password.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Express server port |
| `DB_USER` | Yes | Oracle username |
| `DB_PASSWORD` | Yes | Oracle password |
| `DB_CONNECTION_STRING` | Yes | Oracle host:port/service |
| `FRONTEND_URL` | Yes | CORS origin (e.g. `http://localhost:5173`) |
| `JWT_SECRET` | Yes | JWT signing key (min 32 chars) |
| `EMAIL_USER` | Yes | Gmail address for verification emails |
| `EMAIL_PASS` | Yes | Gmail app password (not your login password) |
| `NODE_ENV` | No | `development` or `production` |

## Auth Flow

### Backend
```
┌─────────┐    signup     ┌──────────┐    send email    ┌─────────┐
│  Client │ ─────────────→│  Backend │ ────────────────→│  Gmail  │
└─────────┘               └──────────┘                  └─────────┘
     │                         │                            │
     │    6-digit code         │                            │
     │ ←───────────────────────│←───────────────────────────│
     │                         │                            │
     │    verify-email         │                            │
     │ ───────────────────────→│                            │
     │                         │                            │
     │    login                │                            │
     │ ───────────────────────→│                            │
     │                         │                            │
     │    httpOnly cookie      │                            │
     │ ←───────────────────────│                            │
     │                         │                            │
     │    /api/orders (cookie) │                            │
     │ ───────────────────────→│                            │
```

### Frontend
```
/unauthenticated → /login ──→ /signup ──→ /verify-email ──→ /login ──→ / (Dashboard)
                     ↑                                                    │
                     └──────────────── /logout ←──────────────────────────┘
```

- Unauthenticated users hitting any app route are redirected to `/login`
- After successful login, users are redirected to their originally requested page (or Dashboard)
- The sidebar displays the current user's name, role, and a logout button
- All Axios requests include `withCredentials: true` to send the `oms_session` cookie

## Scripts

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start Oracle container |
| `node scripts/schema.js` | Drop & recreate all tables |
| `node scripts/seed.js` | Insert test data + admin user |
| `npm run dev` (backend) | Start Express dev server |
| `npm run dev` (frontend) | Start Vite dev server |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 1521 already in use | Stop local Oracle listener or map Docker to `1522:1521` |
| `ERR_MODULE_NOT_FOUND` for `jsonwebtoken` / `bcrypt` / `nodemailer` / `cookie-parser` | Run `npm install jsonwebtoken bcrypt cookie-parser nodemailer` in `backend/` |
| CORS errors in browser | Ensure `FRONTEND_URL` in backend `.env` matches your Vite dev server URL |
| Cookie not sent with API calls | Verify `withCredentials: true` in `apiService.js` and `credentials: true` in backend CORS |
| `ORA-01408: such column list already indexed` | Harmless — Oracle auto-indexes `UNIQUE` columns; explicit `CREATE INDEX` is redundant |
| Seed fails with `PLS-00103: Encountered the symbol "/"` | Remove the trailing `/` from `seed.sql` after `END;` |
| Email verification code not received | Check backend console for send errors; ensure `EMAIL_USER` and `EMAIL_PASS` are set |

## Team Roles (Capstone)

| Role | Responsibility |
|------|---------------|
| Database Architect | Oracle schema design, normalization, triggers |
| Backend Developer | Express REST API, Oracle models, auth system |
| Frontend Developer | React UI, Axios integration, dashboard, auth pages |
| DevOps | Docker setup, environment config, deployment |

## License

Capstone Project — Academic Use Only
