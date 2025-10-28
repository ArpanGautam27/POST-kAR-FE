import { useMemo } from 'react';
import Navigation from '../components/layout/Navigation';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const status = (params.get('status') || 'success').toLowerCase();
  const orderId = params.get('orderId') || '';

  const isSuccess = status === 'success';
  const successAnim = new URL('../assets/Success.json', import.meta.url).toString();
  const failureAnim = new URL('../assets/reject.json', import.meta.url).toString();

  const copy = useMemo(() => {
    if (isSuccess) {
      return {
        title: 'Order Confirmed',
        subtitle: 'Thank you for your purchase! Your order is now being prepared.',
        detail: orderId ? `Order ID: ${orderId}` : undefined,
        primaryCtaText: 'View My Orders',
        primaryCtaHref: '/orders',
        secondaryCtaText: 'Continue Shopping',
        secondaryCtaHref: '/products',
        lottie: successAnim,
      };
    }
    return {
      title: 'Order Not Placed',
      subtitle: 'Something went wrong while placing your order. Please try again.',
      detail: 'No charges were made.',
      primaryCtaText: 'Try Again',
      primaryCtaHref: '/checkout',
      secondaryCtaText: 'Return to Cart',
      secondaryCtaHref: '/cart',
      lottie: failureAnim,
    };
  }, [isSuccess, orderId]);

  const LottiePlayer: any = 'lottie-player';

  return (
    <div className="order-confirm-page">
      <Navigation />
      <div className="order-confirm-container">
        <div className={`confirm-card ${isSuccess ? 'success' : 'failure'}`}>
          <div className="lottie-wrap">
            <LottiePlayer
              autoplay
              loop={false}
              mode="normal"
              src={copy.lottie}
              style={{ width: '320px', height: '320px' }}
            />
          </div>
          <h1 className="title">{copy.title}</h1>
          <p className="subtitle">{copy.subtitle}</p>
          {copy.detail && <p className="detail">{copy.detail}</p>}
          <div className="actions">
            <a className="btn primary" href={copy.primaryCtaHref}>{copy.primaryCtaText}</a>
            <a className="btn secondary" href={copy.secondaryCtaHref}>{copy.secondaryCtaText}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
