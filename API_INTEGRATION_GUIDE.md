# API Integration Guide

This guide explains how to integrate the POST-KAR frontend with your backend API.

## Quick Start

### 1. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Backend API Configuration
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_VERSION=v1
VITE_SCANNER_API_URL=https://your-scanner-api-domain.com

# Disable mock data to use real API
VITE_ENABLE_MOCK_DATA=false

# Enable camera permissions
VITE_ENABLE_CAMERA_PERMISSIONS=true
```

### 2. Backend API Endpoints Required

Your backend must implement the following endpoints:

## Products API

### GET /v1/products
Fetch all products

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-001",
      "name": "Product Name",
      "description": "Product description text",
      "thumbnail_url": "https://cdn.example.com/thumb.jpg",
      "image_url": "https://cdn.example.com/full.jpg",
      "image_id": "img-001",
      "video_url": "https://cdn.example.com/video.mp4",
      "metadata": {
        "category": "Electronics",
        "tags": ["tag1", "tag2"],
        "created_at": "2024-01-15T10:00:00Z"
      }
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### GET /v1/products/:id
Fetch a single product by ID

**Parameters:**
- `id` (string) - Product ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "prod-001",
    "name": "Product Name",
    "description": "Product description",
    "thumbnail_url": "https://cdn.example.com/thumb.jpg",
    "image_url": "https://cdn.example.com/full.jpg",
    "image_id": "img-001",
    "video_url": "https://cdn.example.com/video.mp4",
    "metadata": {
      "category": "Electronics",
      "tags": ["tag1", "tag2"]
    }
  }
}
```

**404 Response:**
```json
{
  "success": false,
  "error": "Product not found"
}
```

### GET /v1/products/search?q=query
Search products (optional)

**Query Parameters:**
- `q` (string) - Search query

**Response:** Same format as GET /v1/products

## Authentication API

### POST /api/auth/send-otp
Send OTP to mobile number

**Request Body:**
```json
{
  "mobileNumber": "9876543210",
  "type": "login" | "signup"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otpId": "otp-id-123"
}
```

### POST /api/auth/verify-otp
Verify OTP and authenticate user

**Request Body:**
```json
{
  "mobileNumber": "9876543210",
  "otp": "123456",
  "otpId": "otp-id-123",
  "type": "login" | "signup"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-001",
    "mobileNumber": "9876543210",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### POST /api/auth/refresh-token
Refresh JWT token

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "token": "new-jwt-token"
}
```

### POST /api/auth/logout
Logout user

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/auth/profile
Get current user profile

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-001",
    "mobileNumber": "9876543210",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### PUT /api/auth/profile
Update user profile

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "mobileNumber": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-001",
    "mobileNumber": "9876543210",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

## Scanner API

### POST /api/scanner/detect
Detect image and return associated video URL

**Request Body:**
```json
{
  "image": "base64_encoded_image_data"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/ar-video.mp4",
    "type": "video",
    "metadata": {
      "title": "AR Content Title",
      "description": "AR content description",
      "duration": 30,
      "width": 1920,
      "height": 1080
    }
  }
}
```

**Not Found Response:**
```json
{
  "success": false,
  "error": "No AR content found for this image"
}
```

### GET /api/scanner/media/:imageId
Get media by image ID

**Parameters:**
- `imageId` (string) - Image identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cdn.example.com/ar-video.mp4",
    "type": "video",
    "metadata": {
      "title": "AR Content Title",
      "description": "AR content description"
    }
  }
}
```

## Cart API

### GET /v1/cart
Get user's cart

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "product": {
          "id": "prod-001",
          "name": "Product Name",
          "thumbnail_url": "https://cdn.example.com/thumb.jpg"
        },
        "quantity": 2
      }
    ],
    "totalItems": 2,
    "totalPrice": 199.98
  }
}
```

### POST /v1/cart/items
Add item to cart

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "productId": "prod-001",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "totalItems": 3,
    "totalPrice": 299.97
  }
}
```

### PUT /v1/cart/items/:itemId
Update cart item quantity

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "totalItems": 5,
    "totalPrice": 499.95
  }
}
```

### DELETE /v1/cart/items/:itemId
Remove item from cart

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "totalItems": 2,
    "totalPrice": 199.98
  }
}
```

### DELETE /v1/cart
Clear entire cart

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [],
    "totalItems": 0,
    "totalPrice": 0
  }
}
```

## Orders API

### POST /v1/orders
Create order (checkout)

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod-001",
      "quantity": 2
    }
  ],
  "address": {
    "fullName": "John Doe",
    "phone": "+91 9876543210",
    "line1": "123 Main Street",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "United States"
  },
  "email": "john@example.com",
  "paymentMethod": "COD"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "PK-ABC123",
    "status": "PLACED",
    "paymentMethod": "COD",
    "placedAt": "2024-01-15T10:00:00Z",
    "eta": "2024-01-20T10:00:00Z",
    "address": {...},
    "email": "john@example.com",
    "items": [...],
    "totals": {
      "subtotal": 199.98,
      "shipping": 0,
      "total": 199.98,
      "currency": "USD"
    }
  }
}
```

### GET /v1/orders
Get all user's orders

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "PK-ABC123",
      "status": "PLACED",
      "paymentMethod": "COD",
      "placedAt": "2024-01-15T10:00:00Z",
      "eta": "2024-01-20T10:00:00Z",
      "items": [...],
      "totals": {...}
    }
  ]
}
```

### GET /v1/orders/:orderId
Get specific order details

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "PK-ABC123",
    "status": "PLACED",
    "paymentMethod": "COD",
    "placedAt": "2024-01-15T10:00:00Z",
    "eta": "2024-01-20T10:00:00Z",
    "address": {...},
    "email": "john@example.com",
    "items": [...],
    "totals": {...}
  }
}
```

## Addresses API

### GET /v1/addresses
Get all user's addresses

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "addr-001",
      "fullName": "John Doe",
      "phone": "+91 9876543210",
      "line1": "123 Main Street",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "United States",
      "isDefault": true
    }
  ]
}
```

### POST /v1/addresses
Create new address

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "+91 9876543210",
  "line1": "123 Main Street",
  "line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "United States",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "addr-001",
    "fullName": "John Doe",
    "phone": "+91 9876543210",
    "line1": "123 Main Street",
    "line2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "United States",
    "isDefault": false
  }
}
```

### PUT /v1/addresses/:addressId
Update address

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:** (same as POST, all fields optional)

**Response:** (same as POST)

### DELETE /v1/addresses/:addressId
Delete address

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

## TypeScript Interfaces

The frontend uses these TypeScript interfaces:

```typescript
// Product Interface
interface Product {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  image_url: string;
  image_id: string;
  video_url: string;
  metadata?: {
    category?: string;
    tags?: string[];
    created_at?: string;
  };
}

// API Response Wrapper
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Products Response
interface ProductsResponse extends ApiResponse<Product[]> {}

// Single Product Response
interface ProductResponse extends ApiResponse<Product> {}

// Media Response
interface MediaResponse extends ApiResponse<{
  url: string;
  type: 'image' | 'video';
  metadata?: Record<string, any>;
}> {}
```

## CORS Configuration

Your backend must allow CORS requests from your frontend domain:

```javascript
// Example Express.js CORS configuration
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev server
    'https://your-frontend-domain.com'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

## Image Processing

The scanner sends images as base64-encoded strings. Your backend should:

1. Decode the base64 string
2. Process the image (image recognition, matching, etc.)
3. Look up associated video URL in your database
4. Return the video URL and metadata

Example Node.js processing:

```javascript
app.post('/scanner-api/detect', async (req, res) => {
  try {
    const { image } = req.body;
    
    // Decode base64 image
    const imageBuffer = Buffer.from(image, 'base64');
    
    // Process image (your image recognition logic)
    const detectedImageId = await recognizeImage(imageBuffer);
    
    // Look up video URL
    const media = await database.getMediaByImageId(detectedImageId);
    
    if (!media) {
      return res.status(404).json({
        success: false,
        error: 'No AR content found for this image'
      });
    }
    
    res.json({
      success: true,
      data: {
        url: media.videoUrl,
        type: 'video',
        metadata: {
          title: media.title,
          description: media.description
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

## Testing the Integration

### 1. Test Products API

```bash
curl https://your-api-domain.com/v1/products
```

### 2. Test Product Detail API

```bash
curl https://your-api-domain.com/v1/products/prod-001
```

### 3. Test Scanner API

```bash
curl -X POST https://your-scanner-api-domain.com/detect \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_data"}'
```

## Development Mode

During development, you can use mock data:

1. Set `VITE_ENABLE_MOCK_DATA=true` in `.env.local`
2. The frontend will use `MockProductService` for products
3. Scanner will still attempt to use real API (or show errors)

## Production Deployment

### Frontend Configuration

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Ensure `VITE_ENABLE_MOCK_DATA=false`
3. Configure correct API URLs
4. Deploy with HTTPS enabled (required for camera access)

### Backend Requirements

1. HTTPS enabled (required for camera access)
2. CORS configured for your frontend domain
3. Image processing endpoint ready
4. Database with product and media mappings

## Troubleshooting

### Products not loading
- Check `VITE_API_BASE_URL` is correct
- Verify CORS is configured on backend
- Check browser console for network errors
- Verify API returns correct JSON format

### Scanner not working
- Ensure HTTPS is enabled
- Check camera permissions in browser
- Verify `VITE_SCANNER_API_URL` is correct
- Check image detection endpoint is responding
- Verify base64 encoding is correct

### Video overlay not showing
- Check video URL is accessible
- Verify CORS allows video loading
- Check video format is supported (MP4 recommended)
- Verify response includes `url` field

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API responses match expected format
3. Test API endpoints independently
4. Review network tab in browser DevTools

---

**Note**: The frontend is fully implemented and ready for backend integration. Simply configure the environment variables and implement the required API endpoints.
