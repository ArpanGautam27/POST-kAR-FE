import React, { useState } from 'react';
import type { ProductCardProps } from '../../types';
import './ProductCard.css';

/**
 * ProductCard component displays a product in a card format
 * Implements requirements 1.2, 4.1, 4.2 - responsive card with image, title, description
 */
export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  loading = false,
  comingSoon = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (!loading && !comingSoon) {
      onClick(product.id);
    }
  };

  // cart interactions are intentionally disabled/hidden for now

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  if (loading) {
    return (
      <div className="product-card product-card--loading">
        <div className="product-card__image-skeleton"></div>
      </div>
    );
  }

  return (
    <div 
      className="product-card" 
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`View details for ${product.name}`}
    >
      <div className="product-card__image-container" style={{ position: 'relative' }}>
        {!imageLoaded && !imageError && (
          <div className="product-card__image-skeleton"></div>
        )}
        {imageError ? (
          <img
            src="/android-chrome-512x512.png"
            alt="Placeholder"
            className={`product-card__image product-card__image--loaded`}
            loading="lazy"
          />
        ) : (
          <img
            src={product.thumbnail_url}
            alt={product.name}
            className={`product-card__image ${imageLoaded ? 'product-card__image--loaded' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        {comingSoon && (
          <>
            <div className="product-card__overlay-mask" style={{ position: 'absolute', inset: 0, background: 'rgba(240,240,240,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
            <div className="product-card__coming-soon" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ color: '#ffffff', background: 'rgba(0,0,0,0.6)', padding: '10px 16px', borderRadius: 999, fontWeight: 700, letterSpacing: 0.5 }}>Coming Soon</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
;

export default ProductCard;