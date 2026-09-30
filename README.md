# SRI SURYA TEX — Central Server, Event Broker & Cloud Backend

[![Server](https://img.shields.io/badge/Server-Node.js%20Backend-green?style=for-the-badge&logo=node.js)](http://localhost:10000)
[![Functions](https://img.shields.io/badge/Firebase-Functions%20v2-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![SSE](https://img.shields.io/badge/Real--Time-Server--Sent%20Events-blue?style=for-the-badge)](http://localhost:10000/api/events)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)]()

Central backend server, real-time event broker, and packing engine service for **SRI SURYA TEX** (Erode, Tamil Nadu). Bridges the Administrator Management Portal (`http://localhost:3000`) and the Customer Wholesale Portal (`http://localhost:3001`).

---

## 🏢 Business Details

- **Business**: SRI SURYA TEX
- **Proprietor**: P. MYILSAMY
- **Phone / WhatsApp**: +91 98426 86264
- **GSTIN**: `33DBQPM1973N1ZY`
- **Location**: 185, Eswaran Kovil Kidangu Street, ERODE - 638 001
- **Manufacturing Categories**: Handloom Mats, Rubber Mats, Fancy Mats, Bed Spreads

---

## ⚡ Core Capabilities & Architecture

1. **Centralized REST API**:
   - `GET /api/products` — Retrieve all catalog products.
   - `POST /api/products` — Add a new product, persist to `data/products.json`, and broadcast to clients.
   - `PUT /api/products/:id` — Update product details, stock, or disabled state.
   - `DELETE /api/products/:id` — Remove product from live catalog.
   - `GET /api/settings/store_config` — Retrieve store configuration (`hidePrices`).
   - `POST /api/settings/store_config` — Update store settings & broadcast price visibility state.
   - `POST /api/orders` — Receive wholesale indents and push notifications to store admin.
   - `GET /api/pack-preview` — Simulate master bale packing with query parameters.
   - `GET /api/telemetry` & `GET /health` — Real-time system health, uptime, and memory statistics.

2. **Real-Time Server-Sent Events (SSE) Stream (`/api/events`)**:
   - Provides instant, low-latency push updates to all active browser windows.
   - Crosses port boundaries seamlessly, enabling changes in `localhost:3000` (Owner) to reflect immediately on `localhost:3001` (Customer) without page reloads.

3. **Master Bale Packing Engine (Best-Fit Decreasing)**:
   - Automated mathematical bundling and bale packaging engine based on standard 120-unit transport bales.
   - Minimizes wasted volume and optimizes transport freight handling from Erode.

4. **Interactive Visual Dashboard**:
   - Accessing `http://localhost:10000/` serves a modern HTML5 dashboard featuring:
     - Real-time service status (Firestore, Cloud Functions, Packing Engine).
     - Live 4-category Master Bale packing simulator with interactive quantity adjustment.
     - Direct links to Customer Portal (`:3001`) and Owner Portal (`:3000`).
     - Proprietor and GST compliance badges.

5. **Firebase Cloud Functions v2**:
   - Includes serverless functions: `addProduct`, `updateProduct`, `deleteProduct`, `packOrder`, and `logSecurityAudit` with admin custom claim enforcement.

---

## 🛠️ Technology Stack

- **Runtime**: Node.js (v18+)
- **HTTP / Events**: Native Node.js `http` module with CORS & SSE
- **Cloud Infrastructure**: Firebase Functions v2, Firebase Admin SDK, Cloud Firestore
- **Persistence**: High-reliability atomic JSON file stores (`data/products.json`, `data/store_config.json`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/achudharaa-spec/server.git
cd server

# Install root & functions dependencies
npm install
cd functions && npm install && cd ..
```

### Environment Configuration
Create a `.env` file in the project root:
```env
PORT=10000
FIREBASE_PROJECT_ID=sirsuryatex
FIREBASE_STORAGE_BUCKET=sirsuryatex.firebasestorage.app
CLIENT_USER_URL=http://localhost:3001
CLIENT_OWNER_URL=http://localhost:3000
```

### Starting the Server
```bash
node functions/index.js
```
The server will start on **`http://localhost:10000`**.
- Visual Dashboard: `http://localhost:10000/`
- Health Telemetry: `http://localhost:10000/health`
- Real-Time Event Stream: `http://localhost:10000/api/events`

---

## 📄 License
Private & Proprietary &bull; Sri Surya Tex &bull; All Rights Reserved.
