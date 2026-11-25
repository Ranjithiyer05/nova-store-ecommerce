# NovaStore Full-Stack MERN Architecture & Developer Handbook

This comprehensive manual provides an end-to-end breakdown of the entire **NovaStore** full-stack e-commerce project. Use this document to master the codebase, understand the technical architecture, and present the project in job interviews or portfolio reviews.

---

## 1. System Architecture & High-Level Design

NovaStore is built as a **Decoupled Monorepo** separating client-side presentation, server-side business logic, and cloud database persistence.

```
┌────────────────────────────────────────────────────────┐
│     Client Layer: React 19 + Tailwind CSS (Vercel)     │
│   Single-Page App, React Router v7, Context State,     │
│   Axios Client with Automated Bearer Token Injection   │
└───────────────────────────┬────────────────────────────┘
                            │ HTTPS JSON Requests
                            ▼
┌────────────────────────────────────────────────────────┐
│     API Layer: Node.js + Express.js (Render.com)       │
│  JWT Auth Middleware, Admin Guards, REST Controllers   │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose ODM Driver Queries
                            ▼
┌────────────────────────────────────────────────────────┐
│     Database Layer: MongoDB Atlas Cloud (Port 27017)   │
│   Users (Hashed Bcrypt), Products, Orders Collections  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure & File Inventory

```text
mern-ecommerce/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection logic + DNS SRV fallback
│   ├── controllers/
│   │   ├── productController.js  # Product CRUD, regex search, category filtering
│   │   ├── userController.js     # User registration, authentication, JWT issuing
│   │   └── orderController.js    # Order creation, payments, fulfillment, stats
│   ├── data/
│   │   └── products.js           # Starter product dataset for seeding
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verification (protect) & Admin authorization
│   ├── models/
│   │   ├── productModel.js       # Mongoose Schema for inventory
│   │   ├── userModel.js          # Mongoose Schema with pre('save') bcrypt hashing
│   │   └── orderModel.js         # Mongoose Schema with relational references
│   ├── routes/
│   │   ├── productRoutes.js      # Endpoint mapping for /api/products
│   │   ├── userRoutes.js         # Endpoint mapping for /api/users
│   │   └── orderRoutes.js        # Endpoint mapping for /api/orders
│   ├── utils/
│   │   └── generateToken.js      # 30-day signed JSON Web Token helper
│   ├── .env                      # Secret environment variables (ignored by git)
│   ├── .gitignore                # Protects node_modules and .env from commits
│   ├── package.json              # Node dependencies & custom npm scripts
│   ├── seeder.js                 # Automated script to populate cloud database
│   └── server.js                 # Primary backend entry point
│
├── frontend/
│   ├── public/                   # Static assets, SVG icons, favicon
│   ├── src/
│   │   ├── components/           # Modular, reusable UI components
│   │   │   ├── Navbar.jsx        # Sticky navigation, search, live cart badge, mobile drawer
│   │   │   ├── Hero.jsx          # Promotional banner, social proof, trust indicators
│   │   │   ├── CategorySection.jsx# Visual category grid with hover effects
│   │   │   ├── FeaturedProducts.jsx# Live database catalog with interactive tabs
│   │   │   ├── ProductCard.jsx   # Product display with badges & instant cart action
│   │   │   └── Footer.jsx        # Links, newsletter, SSL security badges
│   │   ├── context/              # Centralized global state management
│   │   │   ├── AuthContext.jsx   # User login, registration, localStorage persistence
│   │   │   └── CartContext.jsx   # Item management, quantity bounds, pricing calculations
│   │   ├── data/
│   │   │   ├── categoriesData.js # Static category navigation metadata
│   │   │   └── mockProducts.js   # Local fallback product data
│   │   ├── pages/                # Top-level route views
│   │   │   ├── HomePage.jsx      # Composite landing page
│   │   │   ├── ProductsPage.jsx  # Catalog with live search, sidebar filters, sorting
│   │   │   ├── ProductDetailsPage.jsx # Product view by ID, stock checks, specs, reviews
│   │   │   ├── CartPage.jsx      # Shopping basket, free shipping tracker, checkout trigger
│   │   │   ├── CheckoutPage.jsx  # Shipping form, simulated payment method selection
│   │   │   ├── OrderDetailsPage.jsx # Order confirmation receipt, payment/delivery status
│   │   │   ├── MyOrdersPage.jsx  # Customer order history table
│   │   │   ├── LoginPage.jsx     # User login screen with validation
│   │   │   ├── RegisterPage.jsx  # User signup screen with password verification
│   │   │   └── admin/
│   │   │       └── AdminDashboardPage.jsx # Metrics dashboard, catalog CRUD, order tracking
│   │   ├── services/
│   │   │   └── api.js            # Axios client with automated Bearer token injection
│   │   ├── App.css               # Baseline application styling overrides
│   │   ├── App.jsx               # Top-level component declaring client routes
│   │   ├── index.css             # Tailwind CSS directives (@tailwind base, etc.)
│   │   └── main.jsx              # React root mounter wrapping BrowserRouter & Contexts
│   ├── index.html                # Single-Page Application HTML shell
│   ├── package.json              # Client libraries (React 19, Tailwind, Lucide, Axios)
│   ├── tailwind.config.js        # Tailwind purge paths and theme extensions
│   ├── vercel.json               # SPA rewrite configuration for Vercel
│   └── vite.config.js            # Vite build engine configuration
│
└── README.md                     # Public repository documentation
```

---

## 3. Core Technical Concepts & Deep Dive

### A. Authentication & Cryptography
1. **Password Hashing (`userModel.js`)**:
   - Storing plaintext passwords violates cybersecurity standards.
   - We use `bcryptjs` within a Mongoose `.pre('save')` lifecycle hook.
   - When a user signs up or changes their password, `bcrypt.genSalt(10)` creates a cryptographic salt. `bcrypt.hash()` produces a one-way digest.
   - The password comparison method (`matchPassword`) uses `bcrypt.compare()`. It calculates whether the candidate password yields the identical hash without ever decrypting the stored hash.

2. **Stateless JWT Authorization (`authMiddleware.js` & `generateToken.js`)**:
   - Rather than storing server-side session memory, the backend issues a cryptographically signed **JSON Web Token (JWT)** using `jsonwebtoken`.
   - The payload contains the user's MongoDB `_id` and is signed with `process.env.JWT_SECRET` with a 30-day expiration (`expiresIn: '30d'`).
   - The `protect` middleware extracts the token from the HTTP header (`Authorization: Bearer <token>`), decodes it with `jwt.verify()`, and attaches the sanitized user object (`.select('-password')`) directly to `req.user`.

### B. Global State Management via React Context
1. **`AuthContext.jsx`**:
   - Manages user session state (`user`, `login`, `register`, `logout`).
   - Synchronizes with `localStorage.getItem('userInfo')` on initialization so user authentication persists across tab closes and page refreshes.
2. **`CartContext.jsx`**:
   - Manages items, quantities, and financial math.
   - Restricts quantity additions using the item's `countInStock`.
   - Automatically computes four financial variables on state changes:
     - `itemsPrice`: Sum of (price * quantity)
     - `shippingPrice`: Free if `itemsPrice` > $50; otherwise $10.00.
     - `taxPrice`: Estimated at 8% (0.08 * itemsPrice).
     - `totalPrice`: itemsPrice + shippingPrice + taxPrice.

### C. Axios Request Interceptor (`api.js`)
Instead of manually passing headers on every network request, an interceptor automatically checks `localStorage` for a valid token:
```javascript
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});
```

### D. Server-Side Filtering, Searching, & Debouncing
- In `productController.js`, queries leverage MongoDB operators:
  - `$or` with `$regex` and `$options: 'i'` provides case-insensitive search across both product names and brand names.
  - Category matching filters by slug.
  - Sorting orders by ascending/descending prices or popularity.
- In `ProductsPage.jsx`, inputs use a 300ms **debounce timer** with `setTimeout` and cleanup functions inside `useEffect`. This prevents excessive API traffic while the user is actively typing.

---

## 4. End-to-End Purchase Flow Walkthrough

```
1. Customer views /product/:id
   └─ React fetches GET /api/products/:id via Axios.
   └─ MongoDB returns product details and countInStock.

2. Customer clicks "Add to Cart"
   └─ CartContext updates cartItems state.
   └─ State syncs to browser localStorage.
   └─ Navbar badge count updates automatically.

3. Customer navigates to /checkout
   └─ React checks AuthContext. If unauthenticated, redirects to /login.
   └─ Customer enters shipping address and selects payment method.

4. Customer clicks "Place Order & Pay Now"
   └─ POST /api/orders sends order payload.
   └─ Axios Interceptor attaches Bearer <JWT Token>.
   └─ Backend authMiddleware verifies token and assigns req.user._id.
   └─ Order.create() persists order in MongoDB with isPaid: false.
   └─ Frontend triggers PUT /api/orders/:id/pay (Simulated Payment).
   └─ Backend updates isPaid: true, paidAt: Date.now().
   └─ CartContext.clearCart() flushes the cart.
   └─ React navigates to /order/:id receipt view.
```

---

## 5. Production Cloud Deployment Architecture

1. **Frontend (Vercel)**:
   - Configured with `frontend/vercel.json` rewrite rules to route all traffic to `index.html`, allowing React Router to handle client-side routing.
   - Reads the backend API URL from the environment variable `VITE_API_URL`.
2. **Backend (Render.com)**:
   - Hosted as a persistent web service running `node server.js` from the `backend/` directory.
   - Secures cloud database credentials through `MONGO_URI` and `JWT_SECRET`.
3. **Database (MongoDB Atlas)**:
   - Hosted on a multi-region cloud cluster.
   - Network access is configured with IP whitelist `0.0.0.0/0` to allow dynamic connections from Render's hosting infrastructure.

---

## 6. How to Run the Project Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ranjithiyer05/nova-store-ecommerce.git
   cd nova-store-ecommerce
   ```
2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Ensure .env contains:
   # MONGO_URI=mongodb+srv://...
   # JWT_SECRET=novastore_super_secret_jwt_key_2026
   # PORT=5000
   npm run seed    # Seeds database
   npm run dev     # Runs on http://localhost:5000
   ```
3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev     # Runs on http://localhost:5173
   ```
