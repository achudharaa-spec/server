# Govindasamy & Co / Surya Tex — Firebase Architecture & Environment Guide

## 📁 1. Collections & Data Schema Overview

### Collection: `products`
Stores all product metadata, pricing, bundle settings, and image URLs.
```json
{
  "id": "prod_101",
  "title": "Heavy Duty Printed Panipat Door Mat",
  "category": "Panipat Mat",
  "baseRate": 1800,
  "unit": "per Bundle",
  "bundlePieces": 10,
  "bundlesPerPack": 8,
  "compressibility": 0.80,
  "minOrderNotice": "Purchased per full Bundle (10 Pcs only)",
  "stockStatus": "IN_STOCK",
  "stockQty": 100,
  "seasonNotice": "Price may differ based on the season item or the stock quantity",
  "description": "Authentic Panipat woven door mat sold in bundles of 10 pieces.",
  "imageUrl": "https://firebasestorage.googleapis.com/v0/b/.../product-images/panipat1.png",
  "createdAt": "2026-08-22T23:00:00.000Z",
  "updatedAt": "2026-08-22T23:00:00.000Z"
}
```

### Collection: `categories`
Stores product categories available in the store catalog.
```json
{
  "id": "cat_01",
  "name": "Panipat Mat",
  "createdAt": "2026-08-22T23:00:00.000Z"
}
```

### Collection: `orders`
Stores wholesale customer purchase orders.
```json
{
  "companyName": "Sri Lakshmi Textiles",
  "contactPerson": "Ramesh Kumar",
  "phone": "9876543210",
  "gst": "33AAAAA0000A1Z5",
  "deliveryAddress": "123 Market Road, Erode, Tamil Nadu",
  "items": [],
  "estBales": 3,
  "masterBaleRate": 100,
  "masterBaleTotal": 300,
  "grandTotal": 24300,
  "status": "PENDING",
  "createdAt": "2026-09-30T10:00:00.000Z"
}
```

### Collection: `master_bales`
Stores Master Bale packing breakdown per order.
```json
{
  "orderId": "GSC-ORD-123456",
  "totalBales": 2,
  "totalBundles": 16,
  "totalPieces": 160,
  "bales": []
}
```

### Document: `settings/master_bale_config`
Global configuration for Master Bale surcharge.
```json
{
  "rate": 100,
  "unit": "per Master Bale",
  "description": "Global default rate per packed Master Bale applied to all customer orders"
}
```

---

## 🔐 2. Connecting to a New Firebase Account / Project

Each repository has its own independent `.env` file reading isolated credentials:

### A. Customer Portal (`surya-tex-user/.env`)
```env
VITE_FIREBASE_API_KEY=<Your_New_API_Key>
VITE_FIREBASE_AUTH_DOMAIN=<Your_New_Project_ID>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<Your_New_Project_ID>
VITE_FIREBASE_STORAGE_BUCKET=<Your_New_Project_ID>.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=<Your_New_Messaging_Sender_ID>
VITE_FIREBASE_APP_ID=<Your_New_App_ID>
VITE_FIREBASE_MEASUREMENT_ID=<Your_New_Measurement_ID>
VITE_WHATSAPP_NUMBER=919842932756
VITE_STORE_EMAIL=store@example.com
```

### B. Admin / Owner Portal (`surya-tex-owner/.env`)
```env
VITE_FIREBASE_API_KEY=<Your_New_API_Key>
VITE_FIREBASE_AUTH_DOMAIN=<Your_New_Project_ID>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<Your_New_Project_ID>
VITE_FIREBASE_STORAGE_BUCKET=<Your_New_Project_ID>.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=<Your_New_Messaging_Sender_ID>
VITE_FIREBASE_APP_ID=<Your_New_App_ID>
VITE_FIREBASE_MEASUREMENT_ID=<Your_New_Measurement_ID>
VITE_ADMIN_EMAIL=admin@example.com
```

### C. Server & Cloud Functions (`surya-tex-server/.env`)
```env
FIREBASE_API_KEY=<Your_New_API_Key>
FIREBASE_AUTH_DOMAIN=<Your_New_Project_ID>.firebaseapp.com
FIREBASE_PROJECT_ID=<Your_New_Project_ID>
FIREBASE_STORAGE_BUCKET=<Your_New_Project_ID>.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=<Your_New_Messaging_Sender_ID>
FIREBASE_APP_ID=<Your_New_App_ID>
FIREBASE_MEASUREMENT_ID=<Your_New_Measurement_ID>
ADMIN_EMAIL=admin@example.com
PORT=10000
```

---

## 🚀 3. Setup Steps for a New Firebase Project

1. **Create Web App**: In Firebase Console -> Project Settings -> Add App -> Web.
2. **Copy Credentials**: Paste values into `.env` of each repo as shown above.
3. **Deploy Security Rules**:
   ```bash
   cd surya-tex-server
   firebase use <your-new-project-id>
   firebase deploy --only firestore:rules,storage
   ```
4. **Provision Administrator Custom Claims**:
   In `surya-tex-server`:
   ```bash
   node set_admin_claim.js <admin-email>
   ```
