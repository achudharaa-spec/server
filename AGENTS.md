# AGENTS.md — Developer & AI Agent Guidelines (Server & Cloud Backend)

This document specifies the technical architecture, API endpoint contracts, event broadcasting protocols, and packing algorithms for autonomous AI agents and backend engineers working on **SRI SURYA TEX Server (`surya-tex-server`)**.

---

## 🏛️ Application Architecture & Directory Structure

```
surya-tex-server/
├── data/                    # Persistent storage layer (auto-created)
│   ├── products.json        # Authoritative catalog product store
│   └── store_config.json    # Store settings & price visibility configuration
├── functions/
│   ├── packingEngine.js     # Best-Fit Decreasing 120-unit master bale algorithm
│   ├── index.js             # Main HTTP server, SSE broker, and Firebase Functions v2
│   └── package.json         # Server runtime dependencies
├── public/
│   ├── assets/              # Branding assets: logo.png, logo.jpg, visiting_card.jpg
│   └── index.html           # Visual Dashboard & interactive packing simulator
├── src/
│   ├── firebase.js          # Shared Firebase client configuration
│   └── services/            # Reusable business logic services
├── firestore.rules          # Production Firestore security rules definitions
└── package.json             # Root workspace scripts & tooling
```

---

## 📡 API Specification & SSE Broadcasting Contracts

The server operates as an HTTP server on port 10000. It must maintain universal CORS headers:
```javascript
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Endpoints:

#### 1. Real-Time Events Stream
- **`GET /api/events`**:
  - `Content-Type: text/event-stream`
  - Sends a handshake `data: {"type": "CONNECTED"}`.
  - Keeps connections alive and broadcasts JSON events across all connected clients.

#### 2. Products API
- **`GET /api/products`**:
  - Returns `200 OK` with JSON array of products from `data/products.json`.
- **`POST /api/products`**:
  - Body: Complete product object with `title`, `category`, `baseRate`, `unit`, `bundlePieces`, `bundlesPerPack`, `images` (array of 2 to 4 URLs), etc.
  - Persists to `data/products.json`.
  - Broadcasts via SSE: `{ "type": "PRODUCT_ADDED", "product": newProd }`.
  - Returns `201 Created`.
- **`PUT /api/products/:id`**:
  - Body: Updated fields to merge.
  - Broadcasts via SSE: `{ "type": "PRODUCT_UPDATED", "product": updatedProd }`.
  - Returns `200 OK`.
- **`DELETE /api/products/:id`**:
  - Removes matching product from `data/products.json`.
  - Broadcasts via SSE: `{ "type": "PRODUCT_DELETED", "productId": id }`.
  - Returns `200 OK`.

#### 3. Store Configuration API
- **`GET /api/settings/store_config`**:
  - Returns `{ "hidePrices": boolean, "companyName": string, ... }`.
- **`POST /api/settings/store_config`**:
  - Updates `data/store_config.json`.
  - Broadcasts via SSE: `{ "type": "STORE_CONFIG_UPDATED", "hidePrices": boolean }`.

#### 4. Wholesale Orders API
- **`POST /api/orders`**:
  - Receives placed wholesale indent payload from customer portal.
  - Broadcasts via SSE: `{ "type": "ORDER_PLACED", "order": newOrder }` so active admin dashboards receive an instant notification badge.

---

## 📦 Master Bale Packing Algorithm (Best-Fit Decreasing)

Located in [`functions/packingEngine.js`](file:///e:/Github/surya-tex-server/functions/packingEngine.js):
- **Master Bale Capacity**: 120 Units (or custom bundle pack factor).
- **Sorting**: Items are sorted descending by bundle physical volume footprint.
- **Fitting**: Uses Best-Fit Decreasing (BFD) heuristics to place items into the bale with the smallest sufficient remaining capacity.
- **Output**: Returns an array of packed bales, each itemized with exact bundle counts and remaining capacity.

---

## 🛡️ Data Persistence & Error Resilience Rules

1. Any write operation (`POST /api/products`, `PUT`, `DELETE`, `store_config`) must safely write to disk via JSON stringification with fallback to in-memory state if disk writes encounter file lock conditions.
2. The server must never crash on malformed client JSON bodies (use safe body parser wrapping).
