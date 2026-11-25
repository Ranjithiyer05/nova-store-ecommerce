# NovaStore — Project Presentation & Viva Q&A Guide

This guide is organized as **Question & Answer pairs** covering architecture, security, state management, database operations, and deployment. Use this to prepare for project reviews, viva examinations, and technical interviews.

---

## Part 1: Project Overview & Icebreakers

### Q1: What is NovaStore, and what problem does it solve?
**Answer:**
> "NovaStore is a full-stack e-commerce web application built using the MERN stack (MongoDB, Express.js, React 19, Node.js) with Tailwind CSS. It provides an end-to-end online shopping experience featuring dynamic catalog browsing, live search and filtering, user authentication, a persistent shopping cart, a streamlined checkout flow, and an administrative portal for managing inventory and orders."

---

### Q2: Why did you choose the MERN stack for this project?
**Answer:**
> "The MERN stack allows full-stack JavaScript/TypeScript development across both client and server:
> 1. **React 19 (Frontend)**: Uses component-based architecture and a virtual DOM for fast client-side rendering without full-page reloads.
> 2. **Node.js & Express.js (Backend)**: Provides an asynchronous, event-driven runtime ideal for high-concurrency I/O operations and building REST APIs.
> 3. **MongoDB (Database)**: A document-based NoSQL database whose JSON/BSON format maps naturally to JavaScript objects, allowing flexible schemas for product catalogs.
> 4. **Tailwind CSS**: A utility-first CSS framework enabling responsive, consistent UI styling directly inside JSX."

---

### Q3: How is your codebase structured?
**Answer:**
> "The project follows a **decoupled monorepo** architecture:
> - `frontend/`: Contains the React Single Page Application (SPA), built with Vite. It houses reusable UI components, page views, React Context providers (`AuthContext`, `CartContext`), and Axios API configuration.
> - `backend/`: Follows the **MVC (Model-View-Controller)** pattern. It contains Mongoose models for database schemas, controllers for business logic, routes for HTTP endpoints, and middleware for JWT authentication and error handling."

---

## Part 2: Frontend Architecture & React Concepts

### Q4: What is the difference between client-side routing and traditional routing?
**Answer:**
> "In traditional multi-page websites, clicking a link sends an HTTP request to the server, and the browser reloads the entire HTML document.
> 
> In NovaStore, we use **React Router v7** for **Client-Side Routing (Single Page Application)**. The browser loads the HTML/JavaScript bundle once. When navigating between `/products`, `/cart`, or `/checkout`, React Router intercepts the URL and swaps components in and out of the DOM instantly without refreshing the browser, providing a fast app-like experience."

---

### Q5: Why did you use React Context instead of Redux for state management?
**Answer:**
> "For this application's scope, the **React Context API** provided state sharing across components without the bundle size and boilerplate overhead of Redux:
> - **`AuthContext`**: Manages user login state, registration, logout, and syncs session data with `localStorage`.
> - **`CartContext`**: Manages cart items, enforces inventory stock limits (`countInStock`), and calculates subtotals, free shipping eligibility, and sales taxes dynamically.
> 
> Context is built directly into React, making the application lighter and easier to maintain."

---

### Q6: How does the shopping cart persist if the user refreshes the page?
**Answer:**
> "When `CartContext` initializes, it checks the browser's `localStorage` using `JSON.parse(localStorage.getItem('cartItems'))`. Whenever an item is added, removed, or has its quantity updated, a React `useEffect` hook writes the updated array back to `localStorage`. This ensures cart data persists across browser refreshes and tab closures."

---

### Q7: What is debouncing, and where did you use it?
**Answer:**
> "Debouncing is a performance optimization technique that delays executing a function until a certain amount of time has passed since it was last invoked.
> 
> In `ProductsPage.jsx`, when a user types into the search bar, we use a 300ms debounce timer via `setTimeout` inside `useEffect`. Instead of sending an HTTP request to our server on every keystroke (which would overload the server if someone types quickly), the app waits until the user pauses typing for 300ms before sending the request."

---

## Part 3: Backend, APIs, & Security

### Q8: How does the frontend communicate with the backend?
**Answer:**
> "The frontend uses **Axios** to send asynchronous HTTP requests (GET, POST, PUT, DELETE) to our Express REST API endpoints.
> 
> I configured an **Axios Request Interceptor** in `frontend/src/services/api.js`. Before every outgoing network request, the interceptor checks `localStorage` for a user token. If found, it automatically attaches `Authorization: Bearer <token>` to the HTTP request headers. This ensures protected routes (like checkout and admin actions) remain authenticated without writing custom headers in every component."

---

### Q9: How are passwords secured in your application?
**Answer:**
> "We never store plaintext passwords. In `userModel.js`, I implemented a Mongoose `.pre('save')` lifecycle hook:
> 1. When a user registers or updates their password, `bcryptjs.genSalt(10)` creates a cryptographic salt.
> 2. `bcryptjs.hash()` hashes the password using a one-way cryptographic algorithm before saving the document to MongoDB.
> 3. During login, `user.matchPassword()` uses `bcryptjs.compare()` to check if the entered password matches the stored hash without ever decrypting it."

---

### Q10: How does JWT (JSON Web Token) authentication work?
**Answer:**
> "JWT enables **stateless authentication**:
> 1. Upon successful login or registration, the backend signs a token containing the user's ID (`{ id: user._id }`) using a server-side secret (`process.env.JWT_SECRET`) with a 30-day expiration.
> 2. The client saves this token in `localStorage`.
> 3. For protected routes, the `protect` middleware extracts the token from the `Authorization: Bearer <token>` header, verifies the cryptographic signature with `jwt.verify()`, queries MongoDB for the user (`.select('-password')`), and attaches the user record to `req.user`.
> 4. If the token is missing, expired, or tampered with, the server returns an HTTP 401 Unauthorized status."

---

### Q11: What is the purpose of CORS?
**Answer:**
> "CORS stands for **Cross-Origin Resource Sharing**. By default, web browsers enforce the Same-Origin Policy and block frontend applications running on one origin (e.g. `localhost:5173` or `vercel.app`) from requesting data from an API hosted on another origin (e.g. `localhost:5000` or `onrender.com`).
> 
> On the Express server, we use the `cors` middleware (`app.use(cors())`) to tell the browser that our API allows cross-origin requests."

---

## Part 4: Database & Mongoose

### Q12: How is data structured in MongoDB?
**Answer:**
> "MongoDB is document-oriented and stores data in flexible JSON-like documents grouped into **Collections**:
> 1. **`users` Collection**: Stores name, unique email, hashed password, and an `isAdmin` boolean flag.
> 2. **`products` Collection**: Stores title, price, brand, category, inventory count (`countInStock`), rating, reviews, and image URLs.
> 3. **`orders` Collection**: Stores relational references to the purchasing `User` and purchased `Products` via MongoDB ObjectIds, along with shipping address, payment status (`isPaid`), delivery status (`isDelivered`), and financial breakdowns."

---

### Q13: How does product search work on the database level?
**Answer:**
> "In `productController.js`, we build a dynamic query object:
> - If a search keyword is provided, we use MongoDB's `$or` operator paired with `$regex` and `$options: 'i'` to match titles or brands case-insensitively.
> - If a category is selected, we filter by category slug.
> - We chain `.sort()` to order results by price ascending/descending or popularity.
> 
> Performing filtering and sorting directly in MongoDB ensures the application stays performant as the product catalog grows."

---

### Q14: What is a database seeder script and why did you build one?
**Answer:**
> "A database seeder (`backend/seeder.js`) is an automated script that resets the database and inserts initial sample data. Instead of manually creating products and test accounts through Postman or the MongoDB shell, running `npm run seed` connects to MongoDB, clears old records with `deleteMany()`, and populates the database with 8 categorized products, an Admin account, and a test customer account."

---

## Part 5: Deployment & Operations

### Q15: How is your application deployed in production?
**Answer:**
> "The application uses a **Decoupled Cloud Architecture**:
> - **Frontend (React)**: Deployed on **Vercel**. We added a `vercel.json` file configuring rewrites so that deep links (e.g. `/cart`, `/products`) route to `index.html`, allowing React Router to manage client-side routing.
> - **Backend (Express)**: Deployed on **Render.com** as a Node web service.
> - **Database (MongoDB)**: Hosted on a cloud cluster with **MongoDB Atlas**, secured via IP whitelist (`0.0.0.0/0`) and accessed through encrypted connection strings stored in environment variables.
> 
> The frontend communicates with the backend via the `VITE_API_URL` environment variable."

---

### Q16: How did you ensure sensitive credentials were not exposed on GitHub?
**Answer:**
> "Both the root and backend directories contain `.gitignore` files that explicitly exclude `.env`, `.env.local`, and `node_modules`. Connection strings with database passwords and JWT secret keys reside strictly in local `.env` files and in the hosting providers' secure environment variable settings on Render and Vercel. Only code and public configurations are pushed to Git."

---

## Part 6: Live Presentation Script (Step-by-Step)

Follow this sequence during a live demo:

| Step | What to show | What to say |
| :--- | :--- | :--- |
| **1. Landing Page** | Show the live site on Vercel (`nova-store-ecommerce-eight.vercel.app`) | *"This is NovaStore's homepage. It features a sticky navigation bar with a live cart badge, promotional hero banner with social proof, category navigation, and a trending products section powered by our MongoDB Atlas cloud database."* |
| **2. Search & Filtering** | Click **Products** $\rightarrow$ type `"apple"` in the search bar $\rightarrow$ filter by category | *"On the catalog page, notice how typing 'apple' updates the products in real time. This uses a 300ms client-side debounce to query MongoDB's `$regex` operator on the backend, ensuring low latency."* |
| **3. Product Details** | Click a product card (e.g. Apple Watch) | *"The details page dynamically reads the MongoDB ObjectId from the URL using React Router's `useParams()`. Notice the stock indicator: our quantity selector prevents customers from adding more units than exist in inventory."* |
| **4. Cart & Calculations** | Increase quantity to 2 $\rightarrow$ click **Add to Cart** $\rightarrow$ go to `/cart` | *"The shopping cart is managed globally via React Context and saved to `localStorage`. Notice the automated free shipping tracker: when the subtotal exceeds $50, shipping updates to Free and the 8% tax recalculates instantly."* |
| **5. Checkout & Receipt** | Click **Proceed to Checkout** $\rightarrow$ fill address $\rightarrow$ click **Place Order & Pay** | *"The checkout pipeline verifies authentication, creates a new Order document in MongoDB, simulates payment confirmation, and clears the cart state, landing on an order receipt with live tracking pills."* |
| **6. Admin Portal** | Sign in as `admin@novastore.com` / `adminpassword123` $\rightarrow$ navigate to `/admin` | *"Lastly, here is the Admin Dashboard, protected by role-based JWT middleware. Store managers can monitor real-time sales and order volume, perform full CRUD operations on products, and mark customer shipments as Delivered."* |
