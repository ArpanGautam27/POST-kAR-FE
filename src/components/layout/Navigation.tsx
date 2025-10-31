import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { ProfileDropdown } from '../auth/ProfileDropdown';
import './Navigation.css';
import headerLogoVideo from '../../assets/header_logo_video.mp4';

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

  return (
    <>
      <nav className="landing-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo" aria-label="Home: POST-kAR">
            <video
              className="nav-logo-video"
              src={headerLogoVideo}
              muted
              loop
              playsInline
              autoPlay
            />
          </Link>
          <div className="nav-links">
            <Link to="/free-experience" className="nav-link">Free Experience</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <a href="/scanner/scan_mind.html" className="nav-link scanner-only">Scanner</a>
            <Link to="/cart" className="nav-link nav-cart-link" style={{ display: 'none' }}>
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
            
            {/* Authentication Section */}
            <div className="nav-auth" style={{ display: 'none' }}>
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