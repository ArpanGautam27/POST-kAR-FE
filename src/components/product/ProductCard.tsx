import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import type { ProductCardProps } from '../../types';
import './ProductCard.css';

/**
 * ProductCard component displays a product in a card format
 * Implements requirements 1.2, 4.1, 4.2 - responsive card with image, title, description
 */
export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onClick, 
  loading = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart, isInCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleClick = () => {
    if (!loading) {
      onClick(product.id);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

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
        <div className="product-card__content">
          <div className="product-card__title-skeleton"></div>
          <div className="product-card__description-skeleton"></div>
        </div>
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
      <div className="product-card__image-container">
        {!imageLoaded && !imageError && (
          <div className="product-card__image-skeleton"></div>
        )}
        {imageError ? (
          <div className="product-card__image-fallback">
            <span>Image not available</span>
          </div>
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
      <div className="product-card__content">
        <h3 className="product-card__title">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>
        {product.metadata?.category && (
          <span className="product-card__category">{product.metadata.category}</span>
        )}
        <div className="product-card__actions">
          <span className="product-card__price">$99.99</span>
          <button
            className={`product-card__cart-btn ${addedToCart ? 'product-card__cart-btn--added' : ''} ${isInCart(product.id) ? 'product-card__cart-btn--in-cart' : ''}`}
            onClick={handleAddToCart}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
              }
            }}
            aria-label={isInCart(product.id) ? 'Add another to cart' : 'Add to cart'}
          >
            {addedToCart ? (
              <>✓ Added</>
            ) : isInCart(product.id) ? (
              <>+ Add More</>
            ) : (
              <>🛒 Add to Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;