import { useMemo, useState } from 'react';
import Navigation from '../components/layout/Navigation';
import { useCart } from '../contexts/CartContext';
import './CheckoutPage.css';

// Storage key used by AddressesPage
const STORAGE_KEY = 'pk_addresses_v1';

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);

  const addresses = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  const defaultAddress = useMemo(() => {
    if (!addresses?.length) return null;
    return addresses.find((a: any) => a.isDefault) ?? addresses[0];
  }, [addresses]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const placeOrder = async () => {
    if (!defaultAddress) return;
    setPlacing(true);
    try {
      // Simulate order placement
      await new Promise((r) => setTimeout(r, 1200));
      const oid = `PK-${Date.now().toString(36).toUpperCase()}`;
      const placedAt = new Date().toISOString();
      const eta = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(); // +5 days
      const order = {
        id: oid,
        status: 'PLACED',
        paymentMethod: 'COD',
        placedAt,
        eta,
        address: defaultAddress,
        items: items.map((it) => ({
          id: it.product.id,
          name: it.product.name,
          thumbnail_url: it.product.thumbnail_url,
          quantity: it.quantity,
          unitPrice: 99.99,
          lineTotal: 99.99 * it.quantity,
        })),
        totals: {
          subtotal: totalPrice,
          shipping: 0,
          total: totalPrice,
          currency: 'USD',
        },
      };
      try {
        const raw = localStorage.getItem('pk_orders_v1');
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(order);
        localStorage.setItem('pk_orders_v1', JSON.stringify(list));
      } catch {}
      clearCart();
      window.location.href = `/order-confirmation?status=success&orderId=${encodeURIComponent(oid)}`;
    } catch (e) {
      window.location.href = `/order-confirmation?status=failed`;
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="checkout-page">
      <Navigation />
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <span className="cart-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
        </div>

        <div className="checkout-grid">
          <section className="checkout-section">
            <h2 className="section-title">Delivery Address</h2>
            {defaultAddress ? (
              <div className="address-card">
                <div className="address-name">{defaultAddress.fullName}</div>
                <div className="address-lines">
                  <div>{defaultAddress.line1}{defaultAddress.line2 ? `, ${defaultAddress.line2}` : ''}</div>
                  <div>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.postalCode}</div>
                  <div>{defaultAddress.country}</div>
                </div>
                <div className="address-phone">{defaultAddress.phone}</div>
                <a className="address-manage" href="/addresses?return=/checkout">Change / Manage Addresses</a>
              </div>
            ) : (
              <div className="empty-address">
                <p>No delivery address found.</p>
                <a className="manage-btn" href="/addresses?return=/checkout">Add Address</a>
              </div>
            )}
          </section>

          <section className="checkout-section">
            <h2 className="section-title">Payment Method</h2>
            <div className="payment-card">
              <label className="payment-option">
                <input type="radio" checked readOnly />
                <span>Cash on Delivery (COD)</span>
              </label>
              <p className="payment-note">Online payments will be available soon. For now, only COD is supported.</p>
            </div>
          </section>

          <section className="checkout-section order-summary">
            <h2 className="section-title">Order Summary</h2>
            <div className="summary-items">
              {items.map((it) => (
                <div key={it.product.id} className="summary-item">
                  <div className="summary-info">
                    <img src={it.product.thumbnail_url} alt={it.product.name} onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iMzIiIHk9IjM0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBzdHlsZT0iZmlsbDojYWFhO2ZvbnQtd2VpZ2h0OmJvbGQ7Zm9udC1zaXplOjhweDtmb250LWZhbWlseTpBcmnhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZjtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj5JbWc8L3RleHQ+PC9zdmc+';
                    }} />
                    <div>
                      <div className="summary-name">{it.product.name}</div>
                      <div className="summary-qty">Qty: {it.quantity}</div>
                    </div>
                  </div>
                  <div className="summary-price">{formatPrice(99.99 * it.quantity)}</div>
                </div>
              ))}
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <button className="place-order-btn" disabled={!defaultAddress || placing || items.length === 0} onClick={placeOrder}>
              {placing ? 'Placing Order…' : 'Place Order (COD)'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
