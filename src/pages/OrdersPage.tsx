import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import { orderService } from '../services/OrderService';
import type { Order } from '../services/OrderService';
import { useAuth } from '../contexts/AuthContext';
import './OrdersPage.css';

const STORAGE_KEY = 'pk_orders_v1';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { isAuthenticated } = useAuth();
  const LottiePlayer: any = 'lottie-player';
  const emptyAnim = new URL('../assets/order_now.json', import.meta.url).toString();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Try API first
        const response = await orderService.getOrders();
        if (response.success && response.data) {
          setOrders(response.data);
        } else {
          // Fallback to localStorage
          const raw = localStorage.getItem(STORAGE_KEY);
          setOrders(raw ? JSON.parse(raw) : []);
        }
      } catch (err) {
        console.error('Error loading orders:', err);
        // Fallback to localStorage on error
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          setOrders(raw ? JSON.parse(raw) : []);
        } catch {
          setOrders([]);
        }
      }
    };

    loadOrders();
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
          isAuthenticated ? (
            <div className="orders-empty">
              <div className="orders-empty-lottie">
                <LottiePlayer autoplay loop mode="normal" src={emptyAnim} style={{ width: '360px', height: '360px' }} />
              </div>
              <h2 className="orders-empty-title">You haven’t placed an order yet</h2>
              <p className="orders-empty-sub">Discover AR-enabled products and place your first order now.</p>
              <Link to="/products" className="browse-btn">Explore Products</Link>
            </div>
          ) : (
            <div className="orders-empty">
              <h2 className="orders-empty-title">Login to view your orders</h2>
              <p className="orders-empty-sub">Use the Login button in the top toolbar to sign in and see your past orders.</p>
              <Link to="/products" className="browse-btn">Browse Products</Link>
            </div>
          )
        ) : (
          <div className="orders-list">
            {orders.map((o) => (
              <Link key={o.id} to={`/order/${o.id}`} className="order-card">
                <div className="order-top">
                  <div className="order-id">{o.orderNumber}</div>
                  <span className={`status ${o.status.toLowerCase()}`}>{o.status}</span>
                </div>
                <div className="order-meta">
                  <span>Placed on {new Date(o.createdAt).toLocaleString()}</span>
                  {o.deliveredAt && <span>Delivered on {new Date(o.deliveredAt).toLocaleDateString()}</span>}
                </div>
                <div className="order-items">
                  {o.items.slice(0, 3).map((item, idx) => (
                    <img key={`${item.markerId}-${idx}`} src={item.thumbnailUrl} alt={item.markerName} onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZWVlIi8+PC9zdmc+';
                    }} />
                  ))}
                  {o.items.length > 3 && <span className="more">+{o.items.length - 3} more</span>}
                </div>
                <div className="order-total">
                  <span>Total</span>
                  <span className="price">
                    {formatPrice(o.totalAmount, o.currency)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
