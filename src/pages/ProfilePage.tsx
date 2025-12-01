import React from 'react';
import { Navigation } from '../components/layout/Navigation';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Shield, Mail } from 'lucide-react';
import userAvatarAnim from '../assets/user_avatar.json?url';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="profile-page">
        <Navigation />
        
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {(() => {
                const LottiePlayer = 'lottie-player' as any;
                return (
                  <LottiePlayer
                    src={userAvatarAnim}
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                    style={{ width: 96, height: 96 }}
                  />
                );
              })()}
            </div>
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">Manage your account information</p>
          </div>

          <div className="profile-content">
            <div className="profile-card">
              <h2 className="profile-card-title">Personal Information</h2>
              
              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <Mail size={20} />
                  </div>
                  <div className="profile-info-content">
                    <label className="profile-info-label">Email</label>
                    <div className="profile-info-value">{user?.email || 'Not provided'}</div>
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="profile-info-content">
                    <label className="profile-info-label">Member Since</label>
                    <div className="profile-info-value">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </div>
                  </div>
                </div>

                <div className="profile-info-item">
                  <div className="profile-info-icon">
                    <Shield size={20} />
                  </div>
                  <div className="profile-info-content">
                    <label className="profile-info-label">Account Status</label>
                    <div className="profile-info-value">
                      <span className="status-badge status-verified">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-card">
              <h2 className="profile-card-title">Account Actions</h2>
              <div className="profile-actions">
                <button className="profile-action-button" disabled>
                  Edit Profile
                  <span className="action-badge">Coming Soon</span>
                </button>
                <button className="profile-action-button" disabled>
                  Change Mobile Number
                  <span className="action-badge">Coming Soon</span>
                </button>
                <button className="profile-action-button" disabled>
                  Privacy Settings
                  <span className="action-badge">Coming Soon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
