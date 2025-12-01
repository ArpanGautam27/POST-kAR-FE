import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { ProfileDropdown } from '../auth/ProfileDropdown';
import './Navigation.css';
import headerLogoVideo from '../../assets/logo_new.mp4';
import scannerButtonAnim from '../../assets/scanner_button.json?url';

interface NavigationProps {}

/**
 * Navigation component provides consistent header with navigation options
 * Implements requirements 5.2, 5.5, 2.5 - responsive navigation with breadcrumbs
 * Now integrated with NavigationContext for consistent state management
 */
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
      // Ensure video plays after loading
      video.play().catch(() => {
        // Fallback: try playing again after a short delay
        setTimeout(() => {
          video.play().catch(() => {});
        }, 100);
      });
    };

    const handleCanPlay = () => {
      if (!videoLoaded) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);

    // Force load if video is already loaded
    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoLoaded]);

  return (
    <>
      <nav className="landing-nav">
        <div className="nav-container">
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
          <div className="nav-links">
            <Link to="/free-experience" className="nav-link">Freeverse</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <a href="/scanner/scan_mind.html" className="nav-link" aria-label="Scanner" title="Scanner">
              {(() => {
                const LottiePlayer = 'lottie-player' as any;
                return (
                  <LottiePlayer
                    src={scannerButtonAnim}
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                    style={{ width: 50, height: 50 }}
                  />
                );
              })()}
            </a>
            {totalItems > 0 && (
              <Link to="/cart" className="nav-link nav-cart-link">
                <ShoppingCart size={18} />
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </Link>
            )}
            {/* Authentication Section */}
            <div className="nav-auth">
              {!isLoading && (
                isAuthenticated ? (
                  <ProfileDropdown />
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="nav-login-button"
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navigation;