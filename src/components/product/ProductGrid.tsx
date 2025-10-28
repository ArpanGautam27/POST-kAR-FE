import React from 'react';
import type { ProductGridProps } from '../../types';
import ProductCard from './ProductCard';
import './ProductGrid.css';

/**
 * ProductGrid component displays products in a responsive grid layout
 * Implements requirements 1.1, 1.4, 1.5, 1.6 - responsive grid with loading and empty states
 */
export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading = false, 
  onProductClick 
}) => {
  // Show loading skeleton when loading
  if (loading) {
    return (
      <div className="product-grid">
        <div className="product-grid__container">
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCard
              key={`skeleton-${index}`}
              product={{
                id: '',
                name: '',
                description: '',
                thumbnail_url: '',
                image_url: '',
                image_id: '',
                video_url: ''
              }}
              onClick={() => {}}
              loading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  // Show empty state when no products
  if (!products || products.length === 0) {
    return (
      <div className="product-grid">
        <div className="product-grid__empty">
          <div className="product-grid__empty-icon">
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          </div>
          <h3 className="product-grid__empty-title">No Products Available</h3>
          <p className="product-grid__empty-description">
            We couldn't find any products to display. Please check back later or contact support if this issue persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-grid">
      <div className="product-grid__container">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
            loading={false}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;