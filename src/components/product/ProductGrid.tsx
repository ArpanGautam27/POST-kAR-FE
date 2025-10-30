import React, { useRef } from 'react';
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
  onProductClick,
  cardProps,
  horizontal = false,
  forceFourColumns = false,
  showArrows = false
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
              {...cardProps}
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

  const containerRef = useRef<HTMLDivElement | null>(null);

  const containerClasses = [
    'product-grid__container',
    horizontal ? 'product-grid__container--horizontal' : '',
    !horizontal && forceFourColumns ? 'product-grid__container--four' : ''
  ].filter(Boolean).join(' ');

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="product-grid" style={{ position: 'relative' }}>
      {horizontal && showArrows && (
        <>
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByAmount('left')}
            style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'rgba(0,0,0,0.4)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: 18, cursor: 'pointer' }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByAmount('right')}
            style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'rgba(0,0,0,0.4)', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: 18, cursor: 'pointer' }}
          >
            ›
          </button>
        </>
      )}
      <div ref={containerRef} className={containerClasses}>
        {products.map((product) => (
          <div key={product.id} className="product-grid__item">
            <ProductCard
              product={product}
              onClick={onProductClick}
              loading={false}
              {...cardProps}
            />
            <div className="product-grid__caption">
              <span className="product-grid__name" title={product.name}>{product.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;