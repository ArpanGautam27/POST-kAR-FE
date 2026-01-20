import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavigationProvider } from '../contexts/NavigationContext';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import { withLazyLoading, preloadComponent } from '../utils/lazyLoad';

// Lazy load pages for better performance
const LandingPage = withLazyLoading(() => import('../pages/LandingPage'));
const ProductsPage = withLazyLoading(() => import('../pages/ProductsPage'));
const CategoryPage = withLazyLoading(() => import('../pages/CategoryPage'));
const FreeExperiencePage = withLazyLoading(() => import('../pages/FreeExperiencePage'));
const ProductDetailPage = withLazyLoading(() => import('../pages/ProductDetailPage'));
const CartPage = withLazyLoading(() => import('../pages/CartPage'));
const CheckoutPage = withLazyLoading(() => import('../pages/CheckoutPage'));
const OrderConfirmationPage = withLazyLoading(() => import('../pages/OrderConfirmationPage'));
const OrdersPage = withLazyLoading(() => import('../pages/OrdersPage'));
const OrderDetailPage = withLazyLoading(() => import('../pages/OrderDetailPage'));
const ProfilePage = withLazyLoading(() => import('../pages/ProfilePage'));
const AddressesPage = withLazyLoading(() => import('../pages/AddressesPage'));
const NotFoundPage = withLazyLoading(() => import('../pages/NotFoundPage'));
const OAuthCallbackPage = withLazyLoading(() => import('../pages/OAuthCallbackPage'));

// Preload critical pages for better UX
if (typeof window !== 'undefined') {
  // Preload products page as it's likely to be visited first
  setTimeout(() => {
    preloadComponent(() => import('../pages/ProductsPage'));
    preloadComponent(() => import('../pages/FreeExperiencePage'));
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
              <Route path="/free-experience" element={<FreeExperiencePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />

              {/* Cart route */}
              <Route path="/cart" element={<CartPage />} />
              {/* Checkout route */}
              <Route path="/checkout" element={<CheckoutPage />} />
              {/* Order Confirmation */}
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              {/* Orders */}
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/order/:orderId" element={<OrderDetailPage />} />
              {/* Addresses route */}
              <Route path="/addresses" element={<AddressesPage />} />

              {/* Profile route - protected */}
              <Route path="/profile" element={<ProfilePage />} />

              {/* OAuth callback routes */}
              <Route path="/auth/callback" element={<OAuthCallbackPage />} />
              <Route path="/login/oauth2/code/google" element={<OAuthCallbackPage />} />

              {/* Scanner route */}
              {/* Scanner is served as a static page under public/scanner/scan_mind.html */}
              {/* Links should use <a href="/scanner/scan_mind.html"> to trigger a full-page load */}

              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </CartProvider>
        </NavigationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}