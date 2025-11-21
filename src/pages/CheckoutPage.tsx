import { useMemo, useState } from 'react';
import Navigation from '../components/layout/Navigation';
import { useCart } from '../contexts/CartContext';
import './CheckoutPage.css';

// Storage key used by AddressesPage
const STORAGE_KEY = 'pk_addresses_v1';

type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  // Guest checkout form data
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });

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
    return addresses.find((a: Address) => a.isDefault) ?? addresses[0];
  }, [addresses]);

  // Initialize selected address on first load
  useMemo(() => {
    if (!selectedAddressId && defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
      setFormData({
        email: formData.email,
        fullName: defaultAddress.fullName,
        phone: defaultAddress.phone,
        line1: defaultAddress.line1,
        line2: defaultAddress.line2 || '',
        city: defaultAddress.city,
        state: defaultAddress.state,
        postalCode: defaultAddress.postalCode,
        country: defaultAddress.country,
      });
    }
  }, [addresses]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddressSelect = (addressId: string) => {
    const selected = addresses.find((a: Address) => a.id === addressId);
    if (selected) {
      setSelectedAddressId(addressId);
      setFormData({
        email: formData.email,
        fullName: selected.fullName,
        phone: selected.phone,
        line1: selected.line1,
        line2: selected.line2 || '',
        city: selected.city,
        state: selected.state,
        postalCode: selected.postalCode,
        country: selected.country,
      });
    }
  };
  
  const isFormValid = formData.email && formData.fullName && formData.phone && 
                      formData.line1 && formData.city && formData.state && formData.postalCode;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const placeOrder = async () => {
    if (!isFormValid) return;
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
        address: formData,
        email: formData.email,
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
            <h2 className="section-title">Contact & Delivery Information</h2>
            <div className="checkout-form">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              {addresses.length > 0 ? (
                <>
                  <div className="form-group">
                    <label htmlFor="addressSelect">Select Delivery Address *</label>
                    <select
                      id="addressSelect"
                      value={selectedAddressId || ''}
                      onChange={(e) => handleAddressSelect(e.target.value)}
                      required
                    >
                      <option value="">-- Select an address --</option>
                      {addresses.map((addr: Address) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.fullName} - {addr.line1}, {addr.city} {addr.postalCode}
                          {addr.isDefault ? ' (Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedAddressId && (
                    <div className="selected-address-display">
                      <div className="address-display-item">
                        <strong>Name:</strong> {formData.fullName}
                      </div>
                      <div className="address-display-item">
                        <strong>Phone:</strong> {formData.phone}
                      </div>
                      <div className="address-display-item">
                        <strong>Address:</strong> {formData.line1}
                        {formData.line2 && `, ${formData.line2}`}, {formData.city}, {formData.state} {formData.postalCode}, {formData.country}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="line1">Address Line 1 *</label>
                    <input
                      type="text"
                      id="line1"
                      name="line1"
                      value={formData.line1}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="line2">Address Line 2</label>
                    <input
                      type="text"
                      id="line2"
                      name="line2"
                      value={formData.line2}
                      onChange={handleInputChange}
                      placeholder="Apt 4B (optional)"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="postalCode">Postal Code *</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="country">Country *</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="United States"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
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
            <button className="place-order-btn" disabled={!isFormValid || placing || items.length === 0} onClick={placeOrder}>
              {placing ? 'Placing Order…' : 'Place Order (COD)'}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
