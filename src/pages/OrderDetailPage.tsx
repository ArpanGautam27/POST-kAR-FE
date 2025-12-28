import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import './OrderDetailPage.css';

const STORAGE_KEY = 'pk_orders_v1';

type OrderItem = {
  id: string;
  name: string;
  thumbnail_url?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type Order = {
  id: string;
  status: 'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  placedAt: string; // ISO
  eta?: string; // ISO
  address: any;
  items: OrderItem[];
  totals: { subtotal: number; shipping: number; total: number; currency: string };
};

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: Order[] = raw ? JSON.parse(raw) : [];
      setOrder(list.find(o => o.id === orderId) || null);
    } catch {
      setOrder(null);
    }
  }, [orderId]);

  const formatPrice = (n: number, c: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: c || 'USD' }).format(n);

  const etaText = useMemo(() => {
    if (!order?.eta) return 'TBD';
    const date = new Date(order.eta);
    return `${date.toLocaleDateString()} by 8:00 PM`;
  }, [order?.eta]);

  const shareOrder = async () => {
    const url = window.location.href;
    const text = `Order ${order?.id} placed on ${order ? new Date(order.placedAt).toLocaleString() : ''}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Order', text, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard');
      }
    } catch { }
  };

  const openInvoice = () => {
    if (!order) return;
    const w = window.open('', '_blank');
    if (!w) return;
    const rows = order.items.map(i => `
      <tr>
        <td style="padding:8px;border:1px solid #e5e7eb;">${i.name}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${i.quantity}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${formatPrice(i.unitPrice, order.totals.currency)}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${formatPrice(i.lineTotal, order.totals.currency)}</td>
      </tr>
    `).join('');
    const html = `
      <html>
        <head>
          <title>Invoice ${order.id}</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; padding: 24px; }
            h1 { margin: 0 0 8px; }
            .muted { color: #6b7280; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { text-align: left; background: #f9fafb; padding: 8px; border:1px solid #e5e7eb; }
            .totals { margin-top: 16px; float: right; }
            .totals div { display:flex; justify-content: space-between; gap: 24px; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <div class="muted">Order ID: ${order.id}</div>
          <div class="muted">Placed on: ${new Date(order.placedAt).toLocaleString()}</div>
          <div class="muted">Payment Method: ${order.paymentMethod}</div>
          <h2 style="margin-top:16px;">Billing & Shipping</h2>
          <div>${order.address.fullName}</div>
          <div>${order.address.addressLine1}${order.address.addressLine2 ? ', ' + order.address.addressLine2 : ''}</div>
          <div>${order.address.city}, ${order.address.state} ${order.address.postalCode}</div>
          <div>${order.address.country}</div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="totals">
            <div><span>Subtotal:</span><span>${formatPrice(order.totals.subtotal, order.totals.currency)}</span></div>
            <div><span>Shipping:</span><span>${formatPrice(order.totals.shipping, order.totals.currency)}</span></div>
            <div><strong>Total:</strong><strong>${formatPrice(order.totals.total, order.totals.currency)}</strong></div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
  };

  if (!order) {
    return (
      <div className="order-detail-page">
        <Navigation />
        <div className="order-detail-container">
          <div className="not-found">
            <h2>Order not found</h2>
            <p>Please check the link or view all orders.</p>
            <Link to="/orders" className="btn">Back to Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <Navigation />
      <div className="order-detail-container">
        <div className="header">
          <div>
            <h1>Order Details</h1>
            <div className="muted">Order ID: {order.id}</div>
          </div>
          <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
        </div>

        <div className="grid">
          <section className="card">
            <h2 className="section-title">Delivery ETA</h2>
            <p>Estimated delivery: <strong>{etaText}</strong></p>
            <p className="muted">Placed on {new Date(order.placedAt).toLocaleString()}</p>
          </section>

          <section className="card">
            <h2 className="section-title">Shipping Address</h2>
            <div>{order.address.fullName}</div>
            <div>{order.address.addressLine1}{order.address.addressLine2 ? `, ${order.address.addressLine2}` : ''}</div>
            <div>{order.address.city}, {order.address.state} {order.address.postalCode}</div>
            <div>{order.address.country}</div>
            <div className="muted" style={{ marginTop: 6 }}>Phone: {order.address.phone}</div>
          </section>

          <section className="card items">
            <h2 className="section-title">Items</h2>
            {order.items.map(it => (
              <div key={it.id} className="item-row">
                <div className="item-info">
                  <img src={it.thumbnail_url} alt={it.name} onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PC9zdmc+';
                  }} />
                  <div>
                    <div className="name">{it.name}</div>
                    <div className="muted">Qty: {it.quantity}</div>
                  </div>
                </div>
                <div className="price">{formatPrice(it.lineTotal, order.totals.currency)}</div>
              </div>
            ))}
          </section>

          <section className="card summary">
            <h2 className="section-title">Summary</h2>
            <div className="row"><span>Subtotal</span><span>{formatPrice(order.totals.subtotal, order.totals.currency)}</span></div>
            <div className="row"><span>Shipping</span><span>{formatPrice(order.totals.shipping, order.totals.currency)}</span></div>
            <div className="row total"><span>Total</span><span>{formatPrice(order.totals.total, order.totals.currency)}</span></div>
            <div className="row"><span>Payment Method</span><span>{order.paymentMethod}</span></div>
            <div className="actions">
              <button className="btn primary" onClick={openInvoice}>Download Invoice</button>
              <button className="btn" onClick={shareOrder}>Share</button>
            </div>
          </section>
        </div>

        <div className="footer-actions">
          <Link to="/orders" className="btn">Back to Orders</Link>
          <Link to="/products" className="btn secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
