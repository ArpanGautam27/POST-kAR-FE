import React, { useState } from 'react';
import type { ProductCardProps } from '../../types';
import { getLowestPrice, getMaxDiscount } from '../../types/marker';
import './ProductCard.css';

/**
 * ProductCard component displays a product in a card format
 * Implements requirements 1.2, 4.1, 4.2 - responsive card with image, title, description
 * Extended to show variant pricing and discounts
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  loading = false,
  hidePrice = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (!loading) {
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

  // Calculate pricing from variants if available
  const lowestPrice = product.productTypes ? getLowestPrice(product as any) : 0;
  const maxDiscount = product.productTypes ? getMaxDiscount(product as any) : 0;
  const hasVariants = product.productTypes && product.productTypes.length > 0;

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
      </div>

      {/* Product info section with pricing */}
      {!hidePrice && hasVariants && (
        <div className="product-card__info">
          <h3 className="product-card__name">{product.name}</h3>
          <div className="product-card__pricing">
            <span className="product-card__price">From ₹{lowestPrice}</span>
            {maxDiscount > 0 && (
              <span className="product-card__discount-badge">
                Up to {maxDiscount}% OFF
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
  ;

export default ProductCard;