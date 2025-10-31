import { useState, useEffect } from 'react';
import Navigation from '../components/layout/Navigation';
import ProductGrid from '../components/product/ProductGrid';
import { ProductService } from '../services/ProductService';
import { MockProductService } from '../services/MockProductService';
import { config } from '../config/environment';
 
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
  

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try real API first, fallback to mock if enabled
        // This will load all 17 products from centralized data
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

  // Navigation to product detail is disabled while products are marked as coming soon

  if (error) {
    return (
      <div className="products-page">
        <Navigation />
        <div className="products-container" style={{ paddingTop: 80 }}>
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
    <div className="products-page" style={{ background: 'transparent' }}>
      <Navigation />
      <div className="products-container" style={{ paddingTop: 80 }}>
        <div className="products-header">
          <h1 className="products-title" style={{ textAlign: 'center', width: '100%', color: '#ffffff' }}>Discover Products</h1>
        </div>
        <div>
          <ProductGrid 
            products={products}
            loading={loading}
            onProductClick={() => { /* disabled while coming soon */ }}
            cardProps={{ comingSoon: true, hideCart: true, hidePrice: true }}
          />
        </div>
      </div>
    </div>
  );
}