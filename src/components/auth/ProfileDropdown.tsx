import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown, Package, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import userAvatarAnim from '../../assets/user_avatar.json?url';
import './ProfileDropdown.css';

export const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="profile-trigger"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="profile-avatar">
          {(() => {
            const LottiePlayer = 'lottie-player' as any;
            return (
              <LottiePlayer
                src={userAvatarAnim}
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: 24, height: 24 }}
              />
            );
          })()}
        </div>
        <span className="profile-name">{user.email || 'User'}</span>
        <ChevronDown 
          size={16} 
          className={`profile-chevron ${isOpen ? 'profile-chevron-open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="profile-menu">
          <div className="profile-menu-header">
            <div className="profile-menu-avatar">
              {(() => {
                const LottiePlayer = 'lottie-player' as any;
                return (
                  <LottiePlayer
                    src={userAvatarAnim}
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                    style={{ width: 32, height: 32 }}
                  />
                );
              })()}
            </div>
            <div className="profile-menu-info">
              <div className="profile-menu-name">{user.email || 'User'}</div>
              <div className="profile-menu-mobile">
                {user.email && user.email}
              </div>
            </div>
          </div>

          <div className="profile-menu-divider" />

          <div className="profile-menu-items">
            <Link 
              to="/orders" 
              className="profile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <Package size={16} />
              <span>Orders</span>
            </Link>

            <Link
              to="/cart"
              className="profile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart size={16} />
              <span>Cart</span>
            </Link>

            <Link 
              to="/profile" 
              className="profile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              <span>View Profile</span>
            </Link>

            <Link 
              to="/addresses" 
              className="profile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} />
              <span>Addresses</span>
            </Link>
            
            <button className="profile-menu-item" disabled>
              <Settings size={16} />
              <span>Settings</span>
              <span className="profile-menu-badge">Soon</span>
            </button>
            
            <button 
              className="profile-menu-item profile-menu-logout"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
