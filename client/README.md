# FoodHub Frontend 🍕🛵

A modern, fast, and feature-rich **Zomato-style food ordering web application** built with **React 18, Redux Toolkit, React Router DOM v6, Axios, Tailwind CSS v4, and Lucide Icons**.

---

## 🌟 What is FoodHub Client?

FoodHub Client is the official frontend application for the FoodHub food delivery platform. It enables customers to discover local restaurants, filter dishes by city and cuisine, place food orders with persistent shopping cart management, and rate delivered orders. It also provides a comprehensive **Partner Dashboard** for restaurant owners to manage their venues, food menus, live customer orders, and real-time MongoDB aggregation analytics.

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vite.dev/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (`@reduxjs/toolkit` + `react-redux`)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **HTTP & API**: [Axios](https://axios-http.com/) with automatic JWT bearer token injection & refresh token rotation interceptors
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`) + Custom Glassmorphism Theme
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ✨ Features Overview

### 🍔 For Customers
- **City & Cuisine Filtering**: Browse restaurants in major Indian cities (Bhopal, Delhi, Mumbai, Pune, Bengaluru, etc.) or filter by favorite cuisines.
- **Faceted Search**: Instant text search for restaurant names or dishes with dynamic cuisine counters.
- **Nearby Restaurant Finder**: GeoJSON proximity query using MongoDB `$geoNear` to locate restaurants near specific latitude/longitude coordinates.
- **Interactive Restaurant Menu**: Filter dishes by categories (Starters, Main Course, Biryani, Desserts) and toggle Veg-Only items.
- **Persistent Shopping Cart**: Slide-out cart drawer with quantity adjustments, subtotal calculation, and auto-clearing when switching restaurants.
- **Multi-Method Checkout**: Secure order placement supporting **UPI**, **Credit/Debit Card**, and **Cash on Delivery (COD)**.
- **Order History & Live Status**: Track active and past orders with real-time status badges (`Placed`, `Preparing`, `Delivered`, `Cancelled`).
- **Ratings & Reviews**: Submit 1-to-5 star ratings and reviews for delivered food orders.

### 🏪 For Restaurant Owners
- **Venue Management**: Register new restaurants, update location/cuisines, or modify open/closed operating status.
- **Menu Management**: Add, edit, or delete menu items with custom prices, veg/non-veg tags, and availability status.
- **Live Order Fulfillment**: Manage customer orders in real-time and transition order statuses (`placed → preparing / cancelled`, `preparing → delivered / cancelled`).
- **MongoDB Aggregation Analytics**:
  - **Daily Revenue**: Revenue and order volume trend over selected date ranges.
  - **Top Selling Dishes**: Ranking table of best-selling items by quantity and revenue.
  - **Peak Hours**: 24-hour order distribution visualizer identifying peak ordering times.
  - **Status Breakdown**: Order fulfillment status distribution with percentages.
  - **Top Customers**: Ranking of top-spending customers.
  - **Ratings Summary**: Star distribution breakdown and latest customer reviews.

### 📊 Platform Analytics
- **City Revenue Distribution**: Compare total revenue and order volume across cities.
- **Monthly Revenue Trend**: 12-month platform performance analytics.

---

## 📂 Folder Structure

```
client/
├── public/                 # Static public assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── analytics/      # Charts & visualizers (Revenue, Peak Hours, Status Breakdown)
│   │   ├── auth/           # Route authorization guards (ProtectedRoute.jsx)
│   │   ├── cart/           # CartDrawer.jsx & CheckoutModal.jsx
│   │   ├── common/         # Navbar, Footer, Modal, Pagination, Badges, EmptyState
│   │   └── restaurant/     # RestaurantCard, MenuItemCard, ReviewCard & Owner Modals
│   ├── features/           # Redux Toolkit Slices
│   │   ├── analyticsSlice.js
│   │   ├── authSlice.js
│   │   ├── cartSlice.js
│   │   ├── menuSlice.js
│   │   ├── orderSlice.js
│   │   ├── restaurantSlice.js
│   │   ├── reviewSlice.js
│   │   └── store.js        # Central Redux store configuration
│   ├── hooks/              # Custom React hooks (useAuth, useCart, useRestaurant)
│   ├── pages/              # Main page views
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MyOrdersPage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── OwnerDashboardPage.jsx
│   │   ├── PlatformAnalyticsPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── RestaurantDetailPage.jsx
│   │   └── SearchPage.jsx
│   ├── routes/             # Central route map (AppRoutes.jsx)
│   ├── utils/              # API Axios client, constants, formatters (₹ currency)
│   ├── App.jsx             # Main Application component & Providers
│   ├── index.css           # Tailwind CSS directives & theme styles
│   └── main.jsx            # Entry point
├── index.html              # Main HTML document
├── package.json            # Node.js dependencies & scripts
└── vite.config.js          # Vite setup & backend API proxy configuration
```

---

## 🚀 Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- Running FoodHub backend server on `http://localhost:3000`

### Step-by-Step Setup

1. **Navigate to the client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:5173`. Requests to `/api/*` are automatically proxied to the backend at `http://localhost:3000`.*

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🔐 Demo Credentials

Both accounts use the default password: **`password123`**

| Role | Email | Capabilities |
| --- | --- | --- |
| **Customer** | `customer@foodhub.com` | Browse food, add to cart, checkout, view orders, rate delivered meals |
| **Owner** | `owner@foodhub.com` | Manage restaurants, manage menus, accept/deliver orders, view analytics |

---

## ⚡ API Proxy & CORS Handling

The frontend communicates with the backend via Vite's dev server proxy configured in `vite.config.js`:
```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```
All HTTP requests sent through `api` in `src/utils/api.js` automatically set `withCredentials: true` to send `httpOnly` refresh cookies seamlessly.
