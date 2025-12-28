import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import { orderService, type Order } from '../services/OrderService';
import './OrderDetailPage.css';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) return;

      try {
        setLoading(true);
        const response = await orderService.getOrder(orderId);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error('Error loading order:', error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const formatPrice = (n: number, c: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: c || 'USD' }).format(n);

  const etaText = useMemo(() => {
    if (!order?.deliveredAt) return 'Processing';
    const date = new Date(order.deliveredAt);
    return `Delivered on ${date.toLocaleDateString()}`;
  }, [order?.deliveredAt]);

  const shareOrder = async () => {
    const url = window.location.href;
    const text = `Order ${order?.orderNumber} placed on ${order ? new Date(order.createdAt).toLocaleString() : ''}`;
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
    const rows = order.items.map(item => `
      <tr>
        <td style="padding:8px;border:1px solid #e5e7eb;">${item.markerName}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${item.quantity}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${formatPrice(item.unitPrice, order.currency)}</td>
        <td style="padding:8px;border:1px solid #e5e7eb;">${formatPrice(item.totalPrice, order.currency)}</td>
      </tr>
    `).join('');
    const html = `
      <html>
        <head>
          <title>Invoice ${order.orderNumber}</title>
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
          <div class="muted">Order Number: ${order.orderNumber}</div>
          <div class="muted">Placed on: ${new Date(order.createdAt).toLocaleString()}</div>
          <h2 style="margin-top:16px;">Billing & Shipping</h2>
          <div>${order.shippingAddress.fullName}</div>
          <div>${order.shippingAddress.addressLine1}${order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}</div>
          <div>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}</div>
          <div>${order.shippingAddress.country}</div>
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
            <div><strong>Total:</strong><strong>${formatPrice(order.totalAmount, order.currency)}</strong></div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `;
    w.document.write(html);
    w.document.close();
  };

  if (loading) {
    return (
      <div className="order-detail-page">
        <Navigation />
        <div className="order-detail-container">
          <div className="not-found">
            <h2>Loading order...</h2>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="muted">Order Number: {order.orderNumber}</div>
          </div>
          <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
        </div>

        <div className="grid">
          <section className="card">
            <h2 className="section-title">Delivery Status</h2>
            <p><strong>{etaText}</strong></p>
            <p className="muted">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </section>

          <section className="card">
            <h2 className="section-title">Shipping Address</h2>
            <div>{order.shippingAddress.fullName}</div>
            <div>{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}</div>
            <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</div>
            <div>{order.shippingAddress.country}</div>
            <div className="muted" style={{ marginTop: 6 }}>Phone: {order.shippingAddress.phone}</div>
          </section>

          <section className="card items">
            <h2 className="section-title">Items</h2>
            {order.items.map((item, idx) => (
              <div key={`${item.markerId}-${idx}`} className="item-row">
                <div className="item-info">
                  <img src={item.thumbnailUrl} alt={item.markerName} onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZWVlIi8+PC9zdmc+';
                  }} />
                  <div>
                    <div className="name">{item.markerName}</div>
                    <div className="muted">Qty: {item.quantity}</div>
                  </div>
                </div>
                <div className="price">{formatPrice(item.totalPrice, order.currency)}</div>
              </div>
            ))}
          </section>

          <section className="card summary">
            <h2 className="section-title">Summary</h2>
            <div className="row total"><span>Total</span><span>{formatPrice(order.totalAmount, order.currency)}</span></div>
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
