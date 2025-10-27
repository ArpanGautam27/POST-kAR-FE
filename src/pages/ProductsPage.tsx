import { useState, useEffect } from 'react';
import Navigation from '../components/layout/Navigation';
import ProductGrid from '../components/product/ProductGrid';
import { ProductService } from '../services/ProductService';
import { MockProductService } from '../services/MockProductService';
import { config } from '../config/environment';
import { useNavigation } from '../hooks/useNavigation';
import type { Product } from '../types';
import './ProductsPage.css';

// Use real API service or mock based on config
const productService = config.enableMockData 
  ? MockProductService.getInstance() 
  : ProductService.getInstance();

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useNavigation();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try real API first, fallback to mock if enabled
        let productsData: Product[];
        try {
          productsData = await productService.getProducts();
        } catch (apiError) {
          // If real API fails and mock is enabled, try mock service
          if (config.enableMockData) {
            console.warn('API failed, falling back to mock data:', apiError);
            const mockService = MockProductService.getInstance();
            productsData = await mockService.getProducts();
          } else {
            throw apiError;
          }
        }
        
        setProducts(productsData);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (error) {
    return (
      <div className="products-page">
        <Navigation />
        <div className="products-container">
          <div className="error-state">
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <Navigation />
      <div className="products-container">
        <div className="products-header">
          <h1 className="products-title">Discover Products</h1>
          <p className="products-subtitle">
            Explore our collection of AR-enabled products. Click on any product to learn more and access the scanner.
          </p>
        </div>
        
        <ProductGrid 
          products={products}
          loading={loading}
          onProductClick={handleProductClick}
        />
      </div>
    </div>
  );
}