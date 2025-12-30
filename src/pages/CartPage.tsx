import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../hooks/useNavigation';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './CartPage.css';

export default function CartPage() {
  const { items, totalItems, totalPrice, isLoading, removeFromCart, updateQuantity, clearCart } = useCart();
  const { navigate } = useNavigation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);  // ✅ Add error state for terms checkbox

  const handleQuantityChange = (productId: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = () => {
    // ✅ Clear previous error
    setTermsError(false);

    if (!termsAccepted) {
      // ✅ Set error state for visual feedback
      setTermsError(true);
      return;
    }

    // ✅ Removed address check - let users go directly to checkout
    // Checkout page will handle address selection and "Add New Address" option
    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'  // ✅ Changed from USD to INR
    }).format(price);
  };

  // Show loading state while fetching cart
  if (isLoading) {
    return (
      <div className="cart-page">
        <Navigation />
        <div className="cart-container">
          <LoadingSpinner size="small" message="Loading your cart..." />
        </div>
      </div>
    );
  }

  if (items.length === 0 && !isCheckingOut) {
    return (
      <div className="cart-page">
        <Navigation />
        <div className="cart-container">
          <div className="glass-card card-hover empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some amazing AR-enabled products to get started!</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navigation />
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
          {/* ✅ Add Clear Cart button */}
          {items.length > 0 && (
            <button
              className="btn btn-danger"
              onClick={async () => {
                if (window.confirm('Are you sure you want to clear your entire cart?')) {
                  await clearCart();
                }
              }}
              style={{ marginLeft: 'auto' }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {isCheckingOut ? (
          <div className="checkout-loading">
            <LoadingSpinner size="small" message="Processing your order..." />
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div className="cart-item-image">
                    <img
                      src={item.product.thumbnail_url}
                      alt={item.product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHRleHQtYW5jaG9yPSJtaWRkbGUiIHg9IjEwMCIgeT0iMTAwIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjEycHg7Zm9udC1mYW1pbHk6QXJpYWwsSGVsdmV0aWNhLHNhbnMtc2VyaWY7ZG9taW5hbnQtYmFzZWxpbmU6Y2VudHJhbCI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>

                  <div className="cart-item-details">
                    <h3 className="cart-item-name">
                      <Link to={`/product/${item.product.id}`}>
                        {item.product.name}
                      </Link>
                    </h3>
                    {/* Display variant information if available */}
                    {(item.productType || item.size) && (
                      <p className="cart-item-variant">
                        {item.productType && item.size
                          ? `${item.productType} • ${item.size}`
                          : item.productType || item.size
                        }
                      </p>
                    )}
                    <p className="cart-item-description">{item.product.description}</p>
                    {item.product.metadata?.category && (
                      <span className="cart-item-category">{item.product.metadata.category}</span>
                    )}
                  </div>

                  <div className="cart-item-quantity">
                    <label htmlFor={`quantity-${item.product.id}`}>Quantity:</label>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <input
                        id={`quantity-${item.product.id}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product.id, e.target.value)}
                        min="0"
                        className="quantity-input"
                      />
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-price">
                    {/* ✅ Use backend pricing from cart item */}
                    <p className="item-price">₹{item.totalPrice.toFixed(2)}</p>
                    <p className="item-unit-price">@ ₹{item.unitPrice.toFixed(2)} each</p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={async () => {
                      // ✅ Pass productType and size to removeFromCart for correct API call
                      await removeFromCart(item.product.id, item.productType, item.size);
                    }}
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="cart-actions">
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: termsError ? '2px solid #ef4444' : '2px solid transparent',  // ✅ Red border on error
                    backgroundColor: termsError ? 'rgba(239, 68, 68, 0.1)' : 'transparent',  // ✅ Light red background on error
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (e.target.checked) setTermsError(false);  // ✅ Clear error when checked
                    }}
                  />
                  <span>
                    I agree to the <a href="#terms">Terms & Conditions</a>
                  </span>
                </label>
                {/* ✅ Show error message when terms not accepted */}
                {termsError && (
                  <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem', marginLeft: '0.5rem' }}>
                    Please accept the Terms & Conditions to proceed.
                  </p>
                )}
                <Link to="/products" className="continue-shopping-link">
                  ← Continue Shopping
                </Link>
                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={items.length === 0 || !termsAccepted}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
