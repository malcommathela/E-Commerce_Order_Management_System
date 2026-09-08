# E-Commerce Order Management System

A full-stack **E-Commerce Order Management System** developed as a capstone project. The system manages the complete order lifecycle, including staff authentication, customer management, product cataloging, inventory control, order processing, and payment tracking.

The application combines a **React frontend**, **Node.js/Express backend**, and **Oracle Database 21c XE**, with Docker used for local database deployment.

---

## 🚀 Features

### 📦 Order Management

* Customer and supplier management
* Product catalog and category management
* SKU and pricing management
* Real-time inventory tracking
* Automatic inventory deduction when order items are created
* Complete order lifecycle management:

  * `PENDING`
  * `CONFIRMED`
  * `SHIPPED`
  * `DELIVERED`
  * `CANCELLED`
* Order item management
* Payment tracking by order
* Payment method and payment status management

### 🔐 Authentication & Authorization

* Staff registration and authentication
* JWT-based authentication
* Secure `httpOnly` session cookies
* Email verification using 6-digit verification codes
* Gmail SMTP integration through Nodemailer
* Password hashing with bcrypt
* Role-Based Access Control (RBAC)

#### Staff Roles

| Role        | Permissions                                            |
| ----------- | ------------------------------------------------------ |
| **ADMIN**   | Full system access and staff/user management           |
| **MANAGER** | Full CRUD access to business entities                  |
| **STAFF**   | Read access to business data and order creation/update |

All protected API routes require authentication and enforce role-based permissions.

### 📊 Dashboard

The dashboard provides an overview of the system through live KPIs:

* Total orders
* Revenue
* Products
* Customers
* Low-stock products
* Recent orders
* Inventory status

### 🖥️ Frontend

* React 19
* Responsive dashboard layout
* Protected routes
* Role-based navigation
* Search and sorting
* CRUD interfaces
* Modal-based forms
* Authentication pages
* Email verification page
* Data normalization between Oracle and JavaScript naming conventions

---

## 🛠️ Tech Stack

| Layer                | Technology                              |
| -------------------- | --------------------------------------- |
| **Frontend**         | React 19, Vite 8, Axios, React Router 6 |
| **Backend**          | Node.js 20, Express 4, oracledb         |
| **Database**         | Oracle Database 21c XE                  |
| **Authentication**   | JWT, httpOnly Cookies, bcrypt           |
| **Email**            | Nodemailer, Gmail SMTP                  |
| **Database Hosting** | Docker                                  |
| **Development**      | Docker Compose                          |

---

# 🗄️ Database Design

The database follows a **normalized relational design in Third Normal Form (3NF)**.

The system contains **9 core entities**:

| Table        | Description                             |
| ------------ | --------------------------------------- |
| `USERS`      | Internal staff authentication and roles |
| `CUSTOMER`   | End-customer information                |
| `SUPPLIER`   | Product supplier information            |
| `CATEGORY`   | Product categories                      |
| `PRODUCT`    | Product catalog                         |
| `INVENTORY`  | Warehouse inventory and stock           |
| `ORDERS`     | Customer orders                         |
| `ORDER_ITEM` | Products contained in each order        |
| `PAYMENT`    | Payment transactions                    |

### Database Relationships

```text
CUSTOMER
   │
   │ places
   ▼
 ORDERS
   │
   │ contains
   ▼
ORDER_ITEM ───────────► PRODUCT
                          │
                          │ belongs to
                          ▼
                      CATEGORY
                          │
                          │ supplied by
                          ▼
                       SUPPLIER

PRODUCT ───────────────► INVENTORY

ORDERS ────────────────► PAYMENT

USERS
 │
 └── Internal system staff
     ADMIN / MANAGER / STAFF
```

### Database Features

* Primary and foreign key constraints
* Referential integrity
* Check constraints
* Unique constraints
* Database indexes
* Oracle triggers
* Normalized relational structure
* Automatic inventory updates

### Important Triggers

#### `trg_update_inventory`

Automatically deducts inventory when a new `ORDER_ITEM` is inserted.

#### `trg_users_updated_at`

Automatically updates the `updated_at` timestamp when a user record changes.

### Validation Constraints

Examples include:

* Product price must be `>= 0`
* Order quantities must be `> 0`
* Status fields use predefined values
* Foreign keys enforce relationships between entities

---

# 🔌 API Reference

All entity endpoints require a valid authentication cookie unless otherwise specified.

## Authentication

| Method | Endpoint                 | Authentication | Description                     |
| ------ | ------------------------ | -------------- | ------------------------------- |
| `POST` | `/api/auth/signup`       | Public         | Register a staff account        |
| `POST` | `/api/auth/verify-email` | Public         | Verify 6-digit email code       |
| `POST` | `/api/auth/resend-email` | Public         | Resend verification code        |
| `POST` | `/api/auth/login`        | Public         | Authenticate and create session |
| `POST` | `/api/auth/logout`       | Public         | Clear authentication cookie     |
| `GET`  | `/api/auth/me`           | Cookie         | Get current authenticated user  |

### Entity Endpoints

| Resource    | Endpoint          | Create         | Read | Update         | Delete         |
| ----------- | ----------------- | -------------- | ---- | -------------- | -------------- |
| Customers   | `/api/customers`  | ADMIN, MANAGER | ALL  | ADMIN, MANAGER | ADMIN, MANAGER |
| Suppliers   | `/api/suppliers`  | ADMIN, MANAGER | ALL  | ADMIN, MANAGER | ADMIN, MANAGER |
| Categories  | `/api/categories` | ADMIN, MANAGER | ALL  | ADMIN, MANAGER | ADMIN, MANAGER |
| Products    | `/api/products`   | ADMIN, MANAGER | ALL  | ADMIN, MANAGER | ADMIN, MANAGER |
| Inventory   | `/api/inventory`  | ADMIN, MANAGER | ALL  | ADMIN, MANAGER | ADMIN, MANAGER |
| Orders      | `/api/orders`     | ALL            | ALL  | ALL            | ADMIN, MANAGER |
| Order Items | `/api/items`      | ALL            | ALL  | ADMIN, MANAGER | ADMIN, MANAGER |
| Payments    | `/api/payments`   | ADMIN, MANAGER | ALL  | ADMIN, MANAGER | ADMIN, MANAGER |

> `ALL` = `ADMIN`, `MANAGER`, and `STAFF`

---

# 📁 Project Structure

```text
E-Commerce Order Management System/
│
├── backend/
│   ├── scripts/
│   │   ├── schema.sql
│   │   ├── schema.js
│   │   ├── seed.sql
│   │   └── seed.js
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.js
│   │   │   ├── category.js
│   │   │   ├── customer.js
│   │   │   ├── inventory.js
│   │   │   ├── item.js
│   │   │   ├── order.js
│   │   │   ├── payment.js
│   │   │   ├── product.js
│   │   │   └── supplier.js
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   │
│   │   ├── models/
│   │   │   ├── category.js
│   │   │   ├── customer.js
│   │   │   ├── inventory.js
│   │   │   ├── Item.js
│   │   │   ├── order.js
│   │   │   ├── payment.js
│   │   │   ├── product.js
│   │   │   ├── supplier.js
│   │   │   └── user.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── category.js
│   │   │   ├── customer.js
│   │   │   ├── inventory.js
│   │   │   ├── item.js
│   │   │   ├── order.js
│   │   │   ├── payment.js
│   │   │   ├── product.js
│   │   │   └── supplier.js
│   │   │
│   │   ├── utils/
│   │   │   └── email.js
│   │   │
│   │   └── index.js
│   │
│   ├── .env
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── apiService.js
│   │   │   └── auth.js
│   │   │
│   │   ├── components/
│   │   │   ├── DataTable.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── StatCard.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Customers.jsx
│   │   │   ├── Inventory.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── OrderItems.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Payments.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Suppliers.jsx
│   │   │   └── VerifyEmail.jsx
│   │   │
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   └── global.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── .gitignore
├── package.json
└── README.md
```

---

# ⚡ Quick Start

## Prerequisites

Make sure the following are installed:

* **Node.js 20+**
* **Docker Desktop**
* **Git**
* Gmail account with an **App Password** for email verification

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd "E-Commerce Order Management System"
```

---

## 2. Start Oracle Database

```bash
docker-compose up -d
```

The project uses **Oracle Database 21c XE** through Docker.

### Port Conflict

If port `1521` is already being used by another Oracle installation, either stop the local Oracle service or change the Docker mapping:

```yaml
ports:
  - "1522:1521"
```

Then update:

```env
DB_CONNECTION_STRING=localhost:1522/XEPDB1
```

---

## 3. Install Backend Dependencies

```bash
cd backend
npm install
```

If required dependencies are missing:

```bash
npm install jsonwebtoken bcrypt cookie-parser nodemailer
```

---

## 4. Configure Backend Environment

Create:

```text
backend/.env
```

Add:

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

> Never commit `.env` files or production credentials to GitHub.

---

## 5. Initialize the Database

From the `backend` directory:

```bash
node scripts/schema.js
```

This creates the database tables, constraints, triggers, and indexes.

Then run:

```bash
node scripts/seed.js
```

This inserts sample data and creates the pre-verified administrator account.

---

## 6. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:3001/api
```

---

## 7. Start the Backend

```bash
cd ../backend
npm run dev
```

The backend runs on:

```text
http://localhost:3001
```

---

## 8. Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 9. Open the Application

Navigate to:

```text
http://localhost:5173
```

You will be redirected to the login page.

You can either:

* Use the seeded administrator account, or
* Create a new staff account and verify the email address.

---

# 👤 Seeded Administrator

The database seed script creates a pre-verified administrator account.

| Field        | Value                 |
| ------------ | --------------------- |
| **Email**    | `root@gmail.com`      |
| **Password** | `admin123`            |
| **Username** | `admin`               |
| **Role**     | `ADMIN`               |
| **Status**   | Active / Pre-verified |

> ⚠️ **Security:** This account is intended for development/demo purposes. Change or remove the credentials before deploying the application to production.

---

# 🔑 Environment Variables

## Backend

| Variable               | Required | Description                         |
| ---------------------- | -------- | ----------------------------------- |
| `PORT`                 | Yes      | Express server port                 |
| `NODE_ENV`             | Yes      | Application environment             |
| `DB_USER`              | Yes      | Oracle database username            |
| `DB_PASSWORD`          | Yes      | Oracle database password            |
| `DB_CONNECTION_STRING` | Yes      | Oracle host, port, and service      |
| `FRONTEND_URL`         | Yes      | Allowed frontend origin             |
| `JWT_SECRET`           | Yes      | Secret used to sign JWTs            |
| `EMAIL_USER`           | Yes      | Gmail account used for verification |
| `EMAIL_PASS`           | Yes      | Gmail App Password                  |

## Frontend

| Variable       | Required | Description          |
| -------------- | -------- | -------------------- |
| `VITE_API_URL` | Yes      | Backend API base URL |

---

# 🔐 Authentication Flow

The authentication system follows this flow:

```text
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ Signup
     ▼
┌──────────┐
│ Backend  │
└────┬─────┘
     │
     │ Generate verification code
     ▼
┌──────────┐
│  Gmail   │
└────┬─────┘
     │
     │ Verification email
     ▼
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ Verify 6-digit code
     ▼
┌──────────┐
│ Backend  │
└────┬─────┘
     │
     │ Login
     ▼
┌──────────────────┐
│ httpOnly Cookie  │
│   oms_session    │
└────────┬─────────┘
         │
         │ Authenticated API requests
         ▼
┌──────────────────┐
│ Protected APIs   │
└──────────────────┘
```

### Frontend Authentication Flow

```text
/signup
   │
   ▼
/verify-email
   │
   ▼
/login
   │
   ▼
/dashboard
   │
   ├── Customers
   ├── Suppliers
   ├── Categories
   ├── Products
   ├── Inventory
   ├── Orders
   ├── Order Items
   └── Payments
```

### Security Model

* Passwords are hashed using bcrypt
* Authentication uses JWTs
* JWTs are stored in `httpOnly` cookies
* Protected API routes use authentication middleware
* Role permissions are enforced on the backend
* Frontend protected routes prevent unauthorized navigation
* Axios sends credentials using `withCredentials: true`

---

# 📜 Available Scripts

### Database

```bash
docker-compose up -d
```

Starts the Oracle database container.

```bash
node scripts/schema.js
```

Drops and recreates the database schema.

```bash
node scripts/seed.js
```

Inserts sample data and the seeded administrator.

### Backend

```bash
npm run dev
```

Starts the Express development server.

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

---

# 🧪 Troubleshooting

| Problem                                                            | Solution                                                        |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| Port `1521` already in use                                         | Stop the local Oracle listener or map Docker to `1522:1521`     |
| Missing `jsonwebtoken`, `bcrypt`, `nodemailer`, or `cookie-parser` | Run `npm install` or install the packages manually              |
| CORS errors                                                        | Verify `FRONTEND_URL` matches the frontend URL                  |
| Authentication cookie not sent                                     | Verify Axios uses `withCredentials: true`                       |
| Oracle connection failure                                          | Check Docker container status and database connection settings  |
| Email verification not received                                    | Verify Gmail credentials and App Password                       |
| `ORA-01408` duplicate index                                        | Oracle may already have an index created by a unique constraint |
| `PLS-00103` near `/` in seed script                                | Remove the trailing `/` after the PL/SQL block                  |
| Database tables missing                                            | Run `node scripts/schema.js` followed by `node scripts/seed.js` |

---

# 👥 Capstone Team Responsibilities

| Role                   | Responsibilities                                                     |
| ---------------------- | -------------------------------------------------------------------- |
| **Database Architect** | Database design, normalization, relationships, constraints, triggers |
| **Backend Developer**  | REST API, Oracle integration, authentication, authorization          |
| **Frontend Developer** | React interface, routing, API integration, dashboard                 |
| **DevOps**             | Docker configuration, environment management, development setup      |

---

# 🎯 Project Objectives

The system was designed to demonstrate practical implementation of:

* Relational database design
* Database normalization
* SQL and PL/SQL
* Oracle triggers and constraints
* RESTful API development
* Authentication and authorization
* Role-Based Access Control
* Full-stack web development
* Frontend/backend integration
* Docker-based database deployment
* Secure session management
* CRUD application architecture

---

# 🔮 Future Improvements

Potential future enhancements include:

* Advanced reporting and analytics
* Sales charts and revenue analysis
* PDF invoice generation
* Automated order notifications
* Password reset functionality
* Product image management
* Advanced inventory alerts
* Audit logging
* Pagination and server-side filtering
* Automated testing
* CI/CD pipeline
* Production deployment
* Payment gateway integration

---

# 📄 License

**Capstone Project — Academic Use Only**

Developed for educational and academic purposes.
