# NovaStore — Modern Full-Stack MERN E-Commerce Store

NovaStore is an e-commerce platform built from scratch using the MERN stack (MongoDB, Express.js, React 19, Node.js) and styled with Tailwind CSS.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Tailwind CSS, Lucide React, Axios, React Router v7
- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt password hashing
- **Development Tooling**: Vite, Nodemon, Postman / REST Client

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port 27017

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed     # Populates MongoDB with sample products and users
npm run dev      # Starts Express API on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts React Vite server on http://localhost:5173
```

---

## 👤 Pre-Configured Test Accounts

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@novastore.com` | `adminpassword123` | Full Access: Admin Dashboard (`/admin`), Product CRUD, Order Status Management |
| **Customer** | `sarah@example.com` | `password123` | Shopping, Wishlist, Cart, Checkout, Order Receipts (`/orders`) |

---

## 📦 Features

- **Homepage**: Sticky Glassmorphic Navbar with real-time search, Hero banner with review ratings, Category cards, Trending & Bestsellers tabs, and full Footer.
- **Product Catalog**: Live search, category filters, price range slider ($50–$2,000), stock toggle, and sorting (Price low/high, rating, bestseller).
- **Product Details Page**: Dynamic route `/product/:id`, stock indicators, quantity selectors, specifications tabs, and related product recommendations.
- **Cart & Checkout**: Persistent cart (`localStorage`), progressive free-shipping calculator, simulated payment checkout, and live order generation in MongoDB.
- **User Authentication**: Secure registration and login with bcrypt password hashing and 30-day JWT tokens stored in localStorage.
- **Admin Dashboard (`/admin`)**: Real-time sales analytics, product management (Create, Update, Delete), order fulfillment tracking, and user directories.
