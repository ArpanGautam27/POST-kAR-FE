# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env.development` is already configured for local development:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_API_VERSION=v1
VITE_SCANNER_API_URL=http://localhost:3001/api/scanner
VITE_ENABLE_MOCK_DATA=false
```

**For production**, update `.env.production`:
```env
VITE_API_BASE_URL=https://your-api.com
VITE_SCANNER_API_URL=https://your-api.com/api/scanner
VITE_ENABLE_MOCK_DATA=false
```

### 3. Start Backend Server
Your backend must be running on `http://localhost:3001`:
```bash
# Start your Java/Spring Boot backend
java -jar your-backend.jar
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📁 Key Files

### Services (API Integration)
- `src/services/ProductService.ts` - Products API
- `src/services/AuthService.ts` - Authentication API
- `src/services/CartService.ts` - **NEW** Cart API
- `src/services/OrderService.ts` - **NEW** Orders API
- `src/services/AddressService.ts` - **NEW** Addresses API
- `src/services/MediaService.ts` - Scanner/Media API

### Updated Pages
- `src/pages/ProductsPage.tsx` - Fetches from API
- `src/pages/ProductDetailPage.tsx` - Fetches from API
- `src/pages/CheckoutPage.tsx` - **NEW** Creates orders via API
- `src/pages/OrdersPage.tsx` - **NEW** Fetches orders from API
- `src/pages/AddressesPage.tsx` - **NEW** Full CRUD via API
- `src/pages/ScannerPage.tsx` - Image detection via API

### Documentation
- `API_INTEGRATION_GUIDE.md` - Complete API specifications
- `API_INTEGRATION_SUMMARY.md` - Integration overview
- `BACKEND_IMPLEMENTATION_CHECKLIST.md` - Backend setup checklist

---

## 🎯 Features Implemented

✅ Products listing from API  
✅ Product details from API  
✅ Camera access with WebRTC  
✅ Image capture & detection  
✅ Video overlay for AR content  
✅ HTTPS enforcement  
✅ Camera permission handling  
✅ Error states for all scenarios  
✅ Responsive design  
✅ Mock data fallback  

---

## 🔧 Configuration

### Development (Mock Data)
```env
VITE_ENABLE_MOCK_DATA=true
```
Frontend works independently without backend.

### Production (Real API)
```env
VITE_ENABLE_MOCK_DATA=false
VITE_API_BASE_URL=https://api.postkar.com
VITE_SCANNER_API_URL=https://scanner-api.postkar.com
```
Connects to real backend APIs.

---

## 🌐 Routes

- `/` - Landing page
- `/products` - Products listing
- `/product/:id` - Product details
- `/scanner/scan.html` - AR Scanner

---

## 🔌 Backend API Endpoints Required

### Products
```
GET  /v1/products          # List all products
GET  /v1/products/:id      # Get product by ID
```

### Scanner
```
POST /scanner-api/detect   # Detect image, return video URL
GET  /scanner-api/media/:imageId  # Get media by image ID
```

See `API_INTEGRATION_GUIDE.md` for detailed specs.

---

## 📱 Testing the Scanner

1. Navigate to `/products`
2. Click any product
3. Click "Scan Product" button
4. Allow camera permission
5. Point camera at product image
6. Click "Capture & Scan"
7. Video overlay shows AR content

---

## 🐛 Troubleshooting

### Camera not working?
- Ensure HTTPS (or localhost)
- Allow camera permissions
- Check browser supports WebRTC

### Products not loading?
- Check `VITE_API_BASE_URL`
- Verify backend is running
- Check CORS configuration
- Enable mock data for testing

### Build errors?
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📚 Documentation

- `PROJECT_COMPLETION.md` - Full completion report
- `API_INTEGRATION_GUIDE.md` - Backend integration guide
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `QUICK_START.md` - This file

---

## ✅ Status

**Project is COMPLETE and ready for:**
- Backend API integration
- Production deployment
- End-to-end testing

---

**Need Help?** Check the detailed documentation files above.
