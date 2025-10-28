import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
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
          <User size={16} />
        </div>
        <span className="profile-name">User</span>
        <ChevronDown 
          size={16} 
          className={`profile-chevron ${isOpen ? 'profile-chevron-open' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="profile-menu">
          <div className="profile-menu-header">
            <div className="profile-menu-avatar">
              <User size={20} />
            </div>
            <div className="profile-menu-info">
              <div className="profile-menu-name">User</div>
              <div className="profile-menu-mobile">+91 {user.mobileNumber}</div>
            </div>
          </div>

          <div className="profile-menu-divider" />

          <div className="profile-menu-items">
            <Link 
              to="/profile" 
              className="profile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              <span>View Profile</span>
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
