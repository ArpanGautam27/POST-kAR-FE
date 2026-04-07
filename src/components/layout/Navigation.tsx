import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, LogIn } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { ProfileDropdown } from '../auth/ProfileDropdown';
import './Navigation.css';
import headerLogoVideo from '../../assets/logo_new.mp4';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.postkar.arapp';
const WHATSAPP_NUMBER = '917579122216';
const WHATSAPP_GENERAL_MSG = encodeURIComponent('Hi, I want to buy a Post-kAR product.');

interface NavigationProps { }

export const Navigation: React.FC<NavigationProps> = () => {
  const { totalItems } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setVideoLoaded(true);
      video.setAttribute('data-loaded', 'true');
      video.play().catch(() => {
        setTimeout(() => { video.play().catch(() => { }); }, 100);
      });
    };

    const handleCanPlay = () => {
      if (!videoLoaded) { video.play().catch(() => { }); }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);

    if (video.readyState >= 2) { handleLoadedData(); }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoLoaded]);

  const handleDownloadApp = () => {
    window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  const handleBuyNow = () => {
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_GENERAL_MSG}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <>
      <nav className="landing-nav">
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo" aria-label="Home: POST-kAR">
            <video
              ref={videoRef}
              className="nav-logo-video"
              src={headerLogoVideo}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
            />
          </Link>

          {/* Nav Links */}
          <div className="nav-links">
            <Link to="/products" className="nav-link">Products</Link>

            {totalItems > 0 && (
              <Link to="/cart" className="nav-link nav-cart-link">
                <ShoppingCart size={18} />
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
            )}

            {/* Auth */}
            <div className="nav-auth">
              {/* Login button hidden */}
            </div>

            {/* Action Buttons */}
            <div className="nav-action-buttons">
              <button
                className="nav-buynow-btn"
                onClick={handleBuyNow}
                id="nav-buynow-btn"
                aria-label="Buy Now via WhatsApp"
              >
                <span className="nav-btn-icon">💬</span>
                <span className="nav-btn-label">Buy Now</span>
              </button>
              <button
                className="nav-download-btn"
                onClick={handleDownloadApp}
                id="nav-download-btn"
                aria-label="Download Post-kAR App"
              >
                <span className="nav-btn-icon">▶</span>
                <span className="nav-btn-label">Download App</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navigation;