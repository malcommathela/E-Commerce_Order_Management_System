# E-Commerce Order Management System

A full-stack **E-Commerce Order Management System** built as a capstone project to demonstrate the design and development of a production-style business application.

The system manages the complete order lifecycle—from customer and product management to inventory, order processing, payments, authentication, and role-based access control.

Built with **React, Node.js, Express, and Oracle Database 21c XE**, with Docker used to simplify local Oracle database deployment.

---

## 📌 Overview

The E-Commerce Order Management System provides a centralized platform for managing the core operations of an e-commerce business.

It includes:

* Customer and supplier management
* Product and category management
* Inventory management
* Order processing
* Order item management
* Payment tracking
* Staff authentication
* Email verification
* Role-based access control
* Business analytics dashboard

The project demonstrates how a relational database can be integrated with a modern full-stack web application while maintaining data integrity, authentication, and authorization.

---

# ✨ Features

## 📦 Order & Business Management

* Customer management
* Supplier management
* Product catalog management
* Product category management
* SKU and pricing management
* Real-time inventory tracking
* Automatic inventory deduction when order items are created
* Complete order lifecycle management
* Order item management
* Payment tracking
* Payment method and payment status management

### Order Statuses

```text
PENDING
   ↓
CONFIRMED
   ↓
SHIPPED
   ↓
DELIVERED
```

Orders can also be:

```text
CANCELLED
```

---

## 🔐 Authentication & Authorization

The system includes a complete staff authentication system.

* Staff registration
* JWT-based authentication
* Secure `httpOnly` session cookies
* Six-digit email verification
* Gmail SMTP integration using Nodemailer
* Password hashing with bcrypt
* Role-Based Access Control (RBAC)
* Protected API routes
* Protected frontend routes

### Staff Roles

| Role        | Permissions                                            |
| ----------- | ------------------------------------------------------ |
| **ADMIN**   | Full system access and staff/user management           |
| **MANAGER** | Full CRUD access to business entities                  |
| **STAFF**   | Read access to business data and order creation/update |

Authorization is enforced on the backend, ensuring that users cannot bypass role restrictions by directly calling API endpoints.

---

# 📊 Dashboard

The dashboard provides a centralized overview of the business through key performance indicators.

### Dashboard Metrics

* Total orders
* Revenue
* Products
* Customers
* Low-stock products
* Recent orders
* Inventory status

This gives staff a quick overview of the current state of the business without having to navigate through individual modules.

---

# 🖥️ Frontend

The frontend is built with **React 19** and provides a responsive management interface.

### Frontend capabilities

* Responsive dashboard
* Protected routes
* Role-based navigation
* Search and sorting
* CRUD interfaces
* Modal-based forms
* Authentication pages
* Email verification
* API integration
* Oracle-to-JavaScript data normalization

---

# 🛠️ Technology Stack

| Layer                   | Technology                              |
| ----------------------- | --------------------------------------- |
| **Frontend**            | React 19, Vite 8, Axios, React Router 6 |
| **Backend**             | Node.js 20, Express 4, oracledb         |
| **Database**            | Oracle Database 21c XE                  |
| **Authentication**      | JWT, httpOnly Cookies, bcrypt           |
| **Email**               | Nodemailer, Gmail SMTP                  |
| **Database Deployment** | Docker                                  |
| **Development**         | Docker Compose                          |

---

# 🗄️ Database Architecture

The application uses a **normalized relational database design following Third Normal Form (3NF)**.

The database consists of **9 core entities**:

| Table        | Purpose                                            |
| ------------ | -------------------------------------------------- |
| `USERS`      | Internal staff accounts, authentication, and roles |
| `CUSTOMER`   | Customer information                               |
| `SUPPLIER`   | Supplier information                               |
| `CATEGORY`   | Product categories                                 |
| `PRODUCT`    | Product catalog                                    |
| `INVENTORY`  | Warehouse stock and inventory                      |
| `ORDERS`     | Customer orders                                    |
| `ORDER_ITEM` | Products belonging to orders                       |
| `PAYMENT`    | Payment transactions                               |

## Entity Relationships

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
  └── Internal Staff
       ├── ADMIN
       ├── MANAGER
       └── STAFF
```

## Database Features

* Primary key constraints
* Foreign key constraints
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

Automatically updates the `updated_at` timestamp whenever a user record is modified.

### Validation Rules

Examples of database-level validation include:

* Product price must be greater than or equal to `0`
* Order quantities must be greater than `0`
* Status fields use predefined values
* Foreign keys enforce relationships between entities

---

# 🔌 REST API

All business entity endpoints require an authenticated session unless explicitly stated otherwise.

## Authentication Endpoints

| Method | Endpoint                 | Access        | Description                     |
| ------ | ------------------------ | ------------- | ------------------------------- |
| `POST` | `/api/auth/signup`       | Public        | Register a staff account        |
| `POST` | `/api/auth/verify-email` | Public        | Verify six-digit email code     |
| `POST` | `/api/auth/resend-email` | Public        | Resend verification code        |
| `POST` | `/api/auth/login`        | Public        | Authenticate and create session |
| `POST` | `/api/auth/logout`       | Public        | Clear authentication cookie     |
| `GET`  | `/api/auth/me`           | Authenticated | Get current user                |

## Entity Endpoints

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

# ⚡ Getting Started

## Prerequisites

Install the following before starting:

* **Node.js 20+**
* **Docker Desktop**
* **Git**
* A Gmail account with a **Gmail App Password**

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd "E-Commerce Order Management System"
```

---

## 2. Start Oracle Database

Start the Oracle Database container:

```bash
docker-compose up -d
```

The project uses **Oracle Database 21c XE** running through Docker.

### Port Conflict

If port `1521` is already being used, either stop the existing Oracle service or change the Docker port mapping:

```yaml
ports:
  - "1522:1521"
```

Then update the backend connection string:

```env
DB_CONNECTION_STRING=localhost:1522/XEPDB1
```

---

## 3. Install Backend Dependencies

```bash
cd backend
npm install
```

If required packages are missing:

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

> **Security:** Never commit `.env` files, JWT secrets, Gmail credentials, or other production secrets to GitHub.

---

## 5. Initialize the Database

From the `backend` directory:

```bash
node scripts/schema.js
```

This creates the database schema, including:

* Tables
* Constraints
* Indexes
* Triggers
* Relationships

Then populate the database:

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

From the backend directory:

```bash
cd ../backend
npm run dev
```

The backend will run at:

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

The frontend will run at:

```text
http://localhost:5173
```

---

## 9. Open the Application

Open:

```text
http://localhost:5173
```

You will be redirected to the login page.

You can either:

1. Use the seeded administrator account, or
2. Create a new staff account and complete email verification.

---

# 👤 Development Administrator

The database seed script creates a pre-verified administrator account.

| Field        | Value                 |
| ------------ | --------------------- |
| **Email**    | `root@gmail.com`      |
| **Password** | `admin123`            |
| **Username** | `admin`               |
| **Role**     | `ADMIN`               |
| **Status**   | Active / Pre-verified |

> ⚠️ **Important:** These credentials are intended only for development/demo purposes. Change or remove them before deploying the application to production.

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

# 🔐 Authentication Architecture

The authentication system follows a multi-step verification and session flow.

```text
┌──────────────┐
│    Client    │
└──────┬───────┘
       │
       │ Signup
       ▼
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │
       │ Generate verification code
       ▼
┌──────────────┐
│    Gmail     │
└──────┬───────┘
       │
       │ Verification email
       ▼
┌──────────────┐
│    Client    │
└──────┬───────┘
       │
       │ Verify 6-digit code
       ▼
┌──────────────┐
│   Backend    │
└──────┬───────┘
       │
       │ Login
       ▼
┌────────────────────┐
│  httpOnly Cookie   │
│    oms_session     │
└─────────┬──────────┘
          │
          │ Authenticated requests
          ▼
┌────────────────────┐
│   Protected APIs   │
└────────────────────┘
```

### Frontend Flow

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
* Backend routes enforce role permissions
* Frontend protected routes prevent unauthorized navigation
* Axios sends authentication cookies using `withCredentials: true`

---

# 📜 Available Commands

## Database

Start Oracle:

```bash
docker-compose up -d
```

Create/recreate the schema:

```bash
node scripts/schema.js
```

Seed sample data:

```bash
node scripts/seed.js
```

## Backend

Start the development server:

```bash
npm run dev
```

## Frontend

Start the Vite development server:

```bash
npm run dev
```

---

# 🧪 Troubleshooting

| Problem                             | Solution                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------- |
| Port `1521` already in use          | Stop the local Oracle listener or map Docker to `1522:1521`               |
| Missing dependencies                | Run `npm install` or install the required packages manually               |
| CORS errors                         | Verify `FRONTEND_URL` matches the frontend URL                            |
| Authentication cookie not sent      | Verify Axios uses `withCredentials: true`                                 |
| Oracle connection failure           | Check Docker status and database connection settings                      |
| Email verification not received     | Verify Gmail credentials and App Password                                 |
| `ORA-01408` duplicate index         | Check whether Oracle already created an index through a unique constraint |
| `PLS-00103` near `/` in seed script | Remove the trailing `/` after the PL/SQL block                            |
| Database tables missing             | Run `node scripts/schema.js` followed by `node scripts/seed.js`           |

---

# 👥 Team Responsibilities

| Role                   | Responsibilities                                                         |
| ---------------------- | ------------------------------------------------------------------------ |
| **Database Architect** | Database design, normalization, relationships, constraints, and triggers |
| **Backend Developer**  | REST API, Oracle integration, authentication, and authorization          |
| **Frontend Developer** | React interface, routing, API integration, and dashboard                 |
| **DevOps**             | Docker configuration, environment management, and development setup      |

---

# 🎯 Learning Objectives

This capstone project demonstrates practical implementation of:

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

# 🚀 Future Improvements

Potential improvements include:

* Advanced reporting and analytics
* Sales and revenue charts
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
