import { useState, useEffect } from 'react';
import Navigation from '../components/layout/Navigation';
import Mascot from '../components/common/Mascot';
import ProductGrid from '../components/product/ProductGrid';
import { ProductService } from '../services/ProductService';
 
import type { Product } from '../types';
import './ProductsPage.css';

// Use real API service
const productService = ProductService.getInstance();

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productsData = await productService.getProducts();
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
            onProductClick={(id) => { window.location.href = `/product/${id}`; }}
            cardProps={{ hideCart: true, hidePrice: true }}
            forceFourColumns={true}
          />
        </div>
      </div>
      <Mascot model="products" />
    </div>
  );
}