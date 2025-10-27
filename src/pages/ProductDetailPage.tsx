import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import { ProductService } from '../services/ProductService';
import { MockProductService } from '../services/MockProductService';
import { config } from '../config/environment';
import { useNavigation } from '../hooks/useNavigation';
import { useBreadcrumbs } from '../hooks/useBreadcrumbs';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';
import './ProductDetailPage.css';

// Use real API service or mock based on config
const productService = config.enableMockData 
  ? MockProductService.getInstance() 
  : ProductService.getInstance();

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { navigate, goBack } = useNavigation();
  const { updateBreadcrumbsForPage } = useBreadcrumbs();
  const { addToCart, isInCart, getCartItem, updateQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try real API first, fallback to mock if enabled
        let productData: Product | null;
        try {
          productData = await productService.getProduct(id);
        } catch (apiError) {
          // If real API fails and mock is enabled, try mock service
          if (config.enableMockData) {
            console.warn('API failed, falling back to mock data:', apiError);
            const mockService = MockProductService.getInstance();
            productData = await mockService.getProduct(id);
          } else {
            throw apiError;
          }
        }
        
        if (!productData) {
          setError('Product not found');
        } else {
          setProduct(productData);
          // Update breadcrumbs with product name
          updateBreadcrumbsForPage(window.location.pathname, productData.name);
        }
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, updateBreadcrumbsForPage]);

  const handleScanClick = () => {
    navigate('/scanner/scan.html');
  };

  const handleBackClick = () => {
    goBack();
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleQuantityChange = (change: number) => {
    if (product) {
      const cartItem = getCartItem(product.id);
      if (cartItem) {
        const newQuantity = cartItem.quantity + change;
        updateQuantity(product.id, newQuantity);
      }
    }
  };

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navigation />
        <div className="product-detail-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Navigation />
        <div className="product-detail-container">
          <div className="error-state">
            <h2>Product Not Found</h2>
            <p>{error || 'The product you\'re looking for doesn\'t exist or has been removed.'}</p>
            <div className="error-actions">
              <Link to="/products" className="btn btn-primary">
                Browse Products
              </Link>
              <button onClick={goBack} className="btn btn-secondary">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Navigation />
      <div className="product-detail-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/products" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-content">
          <div className="product-image-section">
            <div className="product-image-container">
              {imageLoading && (
                <div className="image-loading">
                  <div className="image-skeleton"></div>
                </div>
              )}
              <img
                src={imageError ? '/placeholder-image.jpg' : product.image_url}
                alt={product.name}
                className={`product-image ${imageLoading ? 'loading' : ''}`}
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-description">{product.description}</p>
              
              {product.metadata?.category && (
                <div className="product-meta">
                  <span className="product-category">Category: {product.metadata.category}</span>
                </div>
              )}

              <div className="product-price-section">
                <span className="product-price">$99.99</span>
                {isInCart(product.id) && (
                  <div className="quantity-indicator">
                    <span>In Cart: {getCartItem(product.id)?.quantity || 0}</span>
                  </div>
                )}
              </div>

              <div className="product-actions">
                {isInCart(product.id) ? (
                  <div className="cart-controls">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">
                      {getCartItem(product.id)?.quantity || 0}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                  >
                    {addedToCart ? '✓ Added to Cart' : '🛒 Add to Cart'}
                  </button>
                )}
                
                <button 
                  onClick={handleScanClick}
                  className="scan-btn"
                >
                  <span className="scan-icon">📱</span>
                  Scan Product
                </button>
                <button 
                  onClick={handleBackClick}
                  className="back-btn"
                >
                  ← Back to Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}