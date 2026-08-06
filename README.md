# E-Commerce Order Management System

A full-stack order management platform built as a capstone project.  
Handles the complete order lifecycle—from customer registration and product cataloging to inventory deduction, order fulfillment, and payment tracking.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite |
| **Backend** | Node.js, Express |
| **Database** | Oracle XE (Docker) |
| **ORM/DB** | Raw SQL with `oracledb` |
| **DevOps** | Docker Compose |

## Core Features

- Customer & supplier management
- Product catalog with category hierarchy
- Order placement with automatic inventory deduction (Oracle trigger)
- Payment tracking per order
- Real-time stock availability via Inventory module

## Database Design

8 entities in 3NF: `CUSTOMER`, `SUPPLIER`, `CATEGORY`, `PRODUCT`, `INVENTORY`, `ORDERS`, `ORDER_ITEM`, `PAYMENT`.

## Quick Start

```bash
# 1. Start Oracle
docker-compose up -d

# 2. Backend
cd backend && npm install && npm run dev

# 3. Frontend
cd frontend && npm install && npm run dev
