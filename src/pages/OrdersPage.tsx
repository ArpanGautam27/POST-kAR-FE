import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import './OrdersPage.css';

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

const STORAGE_KEY = 'pk_orders_v1';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const LottiePlayer: any = 'lottie-player';
  const emptyAnim = new URL('../assets/order_now.json', import.meta.url).toString();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setOrders(raw ? JSON.parse(raw) : []);
    } catch {
      setOrders([]);
    }
  }, []);

  const formatPrice = (n: number, c: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: c || 'USD' }).format(n);

  const empty = useMemo(() => orders.length === 0, [orders.length]);

  return (
    <div className="orders-page">
      <Navigation />
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          {!empty && <span className="orders-count">{orders.length}</span>}
        </div>

        {empty ? (
          <div className="orders-empty">
            <div className="orders-empty-lottie">
              <LottiePlayer autoplay loop mode="normal" src={emptyAnim} style={{ width: '360px', height: '360px' }} />
            </div>
            <h2 className="orders-empty-title">You haven’t placed an order yet</h2>
            <p className="orders-empty-sub">Discover AR-enabled products and place your first order now.</p>
            <Link to="/products" className="browse-btn">Explore Products</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((o) => (
              <Link key={o.id} to={`/order/${o.id}`} className="order-card">
                <div className="order-top">
                  <div className="order-id">{o.id}</div>
                  <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
                </div>
                <div className="order-meta">
                  <span>Placed on {new Date(o.placedAt).toLocaleString()}</span>
                  {o.eta && <span>ETA {new Date(o.eta).toLocaleDateString()}</span>}
                </div>
                <div className="order-items">
                  {o.items.slice(0, 3).map(i => (
                    <img key={i.id} src={i.thumbnail_url} alt={i.name} onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZWVlIi8+PC9zdmc+';
                    }} />
                  ))}
                  {o.items.length > 3 && <span className="more">+{o.items.length - 3} more</span>}
                </div>
                <div className="order-total">
                  <span>Total</span>
                  <span className="price">{formatPrice(o.totals.total, o.totals.currency)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
