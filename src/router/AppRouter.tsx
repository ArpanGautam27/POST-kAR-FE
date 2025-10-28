import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NavigationProvider } from '../contexts/NavigationContext';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import { withLazyLoading, preloadComponent } from '../utils/lazyLoad';

// Lazy load pages for better performance
const LandingPage = withLazyLoading(() => import('../pages/LandingPage'));
const ProductsPage = withLazyLoading(() => import('../pages/ProductsPage'));
const ProductDetailPage = withLazyLoading(() => import('../pages/ProductDetailPage'));
const ScannerPage = withLazyLoading(() => import('../pages/ScannerPage'));
const CartPage = withLazyLoading(() => import('../pages/CartPage'));
const ProfilePage = withLazyLoading(() => import('../pages/ProfilePage'));
const NotFoundPage = withLazyLoading(() => import('../pages/NotFoundPage'));

// Preload critical pages for better UX
if (typeof window !== 'undefined') {
  // Preload products page as it's likely to be visited first
  setTimeout(() => {
    preloadComponent(() => import('../pages/ProductsPage'));
  }, 1000);
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavigationProvider>
          <CartProvider>
            <Routes>
              {/* Landing page route */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Product routes */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              
              {/* Cart route */}
              <Route path="/cart" element={<CartPage />} />
              
              {/* Profile route - protected */}
              <Route path="/profile" element={<ProfilePage />} />
              
              {/* Scanner route */}
              <Route path="/scanner/scan.html" element={<ScannerPage />} />
              
              {/* Redirect old scanner route if needed */}
              <Route path="/scanner" element={<Navigate to="/scanner/scan.html" replace />} />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </CartProvider>
        </NavigationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}