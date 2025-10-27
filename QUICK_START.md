# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local`:
```env
# For development with mock data
VITE_ENABLE_MOCK_DATA=true

# For production with real API
VITE_ENABLE_MOCK_DATA=false
VITE_API_BASE_URL=https://your-api.com
VITE_SCANNER_API_URL=https://your-scanner-api.com
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📁 Key Files

### New Services
- `src/services/ProductService.ts` - Real API for products
- `src/services/MediaService.ts` - Image detection & video API

### New Hook
- `src/hooks/useCamera.ts` - Camera access & capture

### Updated Pages
- `src/pages/ProductsPage.tsx` - API integrated
- `src/pages/ProductDetailPage.tsx` - API integrated
- `src/pages/ScannerPage.tsx` - **Fully implemented scanner**

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
