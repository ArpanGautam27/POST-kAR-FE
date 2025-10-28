import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../hooks/useNavigation';
import './CartPage.css';

export default function CartPage() {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();
  const { navigate } = useNavigation();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = () => {
    if (!termsAccepted) {
      alert('Please accept the Terms & Conditions before proceeding.');
      return;
    }
    // Check for at least one saved address
    let hasAddress = false;
    try {
      const raw = localStorage.getItem('pk_addresses_v1');
      const list = raw ? JSON.parse(raw) : [];
      hasAddress = Array.isArray(list) && list.length > 0;
    } catch {}

    if (!hasAddress) {
      navigate('/addresses?return=/cart');
      return;
    }

    navigate('/checkout');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (items.length === 0 && !isCheckingOut) {
    return (
      <div className="cart-page">
        <Navigation />
        <div className="cart-container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some amazing AR-enabled products to get started!</p>
            <Link to="/products" className="continue-shopping-btn">
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
        </div>

        {isCheckingOut ? (
          <div className="checkout-loading">
            <div className="spinner"></div>
            <p>Processing your order...</p>
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
                    <p className="item-price">{formatPrice(99.99 * item.quantity)}</p>
                    <p className="item-unit-price">@ {formatPrice(99.99)} each</p>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product.id)}
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
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <span>
                  I agree to the <a href="#terms">Terms & Conditions</a>
                </span>
              </label>
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
