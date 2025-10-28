import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';
import { ProfileDropdown } from '../components/auth/ProfileDropdown';
import arVideo from '../assets/placeholder.mov';
import './LandingPage.css';

// SVG IMPORTS (These are correct)
import xLogo from '../assets/x_logo.svg';
import instagramLogo from '../assets/instagram_logo.svg';
import linkedinLogo from '../assets/linkedin_logo.svg';

export default function LandingPage() {
  const { totalItems } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="landing-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">POST-kAR</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <Link to="/scanner/scan.html" className="nav-link">Scanner</Link>
            <Link to="/cart" className="nav-link nav-cart-link">
              <ShoppingCart size={18} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </Link>
            
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="logo">POST-kAR</h1>
          {/* NEW SLOGAN ADDED HERE */}
          <p className="hero-slogan">"Beyond The Frame"</p>
          <h2 className="hero-title">Experience Culture Through Augmented Reality</h2>
          <p className="hero-subtitle">Transform posters, artworks, and images into living, interactive AR experiences.</p>
          <video
            src={arVideo}
            className="hero-video"
            autoPlay
            loop
            muted
            playsInline
          >
            Your browser does support the video tag.
          </video>
        </div>
      </section>   
   {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <p className="section-subtitle">What makes PostkAR special</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Marker-Based AR</h3>
              <p className="feature-desc">Scan posters, artworks, and photos to unlock dynamic, interactive AR content instantly.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Hybrid Platform</h3>
              <p className="feature-desc">Combines streaming, gaming, and a digital marketplace for collectibles in one experience.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Cultural Storytelling</h3>
              <p className="feature-desc">Experience art, culture, and stories in an engaging, modern way that preserves tradition.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="waitlist-section">
        <div className="container">
          <div className="waitlist-box">
            <h2 className="waitlist-title">Experience POST-kAR</h2>
            <p className="waitlist-desc">Discover our AR-enabled products and start your augmented reality journey today.</p>
            <Link to="/products" className="submit-btn">
              Explore Products
            </Link>
          </div>
        </div>
      </section> 
     {/* About Section */}
      <section className="about-section">
        <div className="container">
          <h2 className="section-title">About NitiNex Studio</h2>
          <p className="about-text">
            NitiNex Studio, founded by <strong>Akash Negi</strong>, is an AR/VR-focused startup specializing in immersive digital experiences. Our flagship project, PostkAR, blends tradition with technology, making cultural storytelling more interactive, accessible, and unforgettable through augmented reality and virtual reality
          </p>
        </div>
      </section>

      {/* NEW: Contact Information Section */}
      <section className="contact-section">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Connect with us</p>
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">📞</div>
              <h3 className="contact-title">Official Contact</h3>
              <a href="tel:+911234567890" className="contact-link">+91 7579122216</a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">✉️</div>
              <h3 className="contact-title">Official Mail</h3>
              <a href="mailto:contact@nitinex.com" className="contact-link">postkar.info@gmail.com</a>
            </div>

            <div className="contact-card">
              <div className="contact-icon">📍</div>
              <h3 className="contact-title">Office Address</h3>
              <p className="contact-link" style={{ cursor: 'default' }}>
                Engineer's Enclave,<br />
               GMS Rd, Kanwali, Dehradun, Uttarakhand 248171
              </p>
            </div>
          </div>
        </div>
      </section>  
    {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <p className="footer-title">Legal</p>
              <div className="footer-links">
                <a href="#terms" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>Terms & Conditions</a>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>Privacy Policy</a>
              </div>
            </div>
            <div className="footer-col">
              <p className="footer-title">Follow Us</p>
              <div className="footer-links social-links">
                {/* Instagram Icon */}
                <a href="https://www.instagram.com/post._.kar?igsh=MWNqdGkxazJjM2xhdA==" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <img src={instagramLogo} alt="Instagram Logo" className="social-icon" />
                </a>
                {/* X (Twitter) Icon */}
                <a href="https://x.com/KarPost71712?t=GO-m45s7DP79vERWDmftLQ&s=09" target="_blank" rel="noopener noreferrer" title="X (Twitter)">
                  <img src={xLogo} alt="X (Twitter) Logo" className="social-icon" />
                </a>
                {/* LinkedIn Icon */}
                <a href="https://www.linkedin.com/in/post-kar-02ab1038a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <img src={linkedinLogo} alt="LinkedIn Logo" className="social-icon" />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            © 2025 NitiNex Studio. All rights reserved.
          </div>
        </div>
      </footer>     

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <div className="modal-overlay">
          <div className="modal-content legal-modal">
            <button className="modal-close" onClick={() => setShowTerms(false)}>×</button>
            <h2 className="modal-title">Terms & Conditions</h2>
            <div className="legal-content">
              <h3>1. Acceptance of Terms</h3>
              <p>By accessing and using PostkAR, you accept and agree to be bound by these Terms & Conditions.</p>

              <h3>2. Use of Service</h3>
              <p>PostkAR provides augmented reality experiences through marker-based technology. Users must be at least 13 years old to use our service. You agree to use the service only for lawful purposes.</p>

              <h3>3. Intellectual Property</h3>
              <p>All content, features, and functionality of PostkAR are owned by NitiNex Studio and are protected by international copyright, trademark, and other intellectual property laws.</p>

              <h3>4. User Content</h3>
              <p>Users may create and share content through PostkAR. By doing so, you grant us a license to use, modify, and display that content within our platform.</p>

              <h3>5. Limitation of Liability</h3>
              <p>NitiNex Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of PostkAR.</p>

              <h3>6. Changes to Terms</h3>
              <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.</p>

              <h3>7. Contact</h3>
              <p>For questions about these Terms & Conditions, please contact us through our official channels.</p>
            </div>
          </div>
        </div>
      )}      
{/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="modal-overlay">
          <div className="modal-content legal-modal">
            <button className="modal-close" onClick={() => setShowPrivacy(false)}>×</button>
            <h2 className="modal-title">Privacy Policy</h2>
            <div className="legal-content">
              <h3>1. Information We Collect</h3>
              <p>We collect information you provide directly to us, including name, email address, and phone number when you join our waitlist. We also collect usage data when you interact with our AR experiences.</p>

              <h3>2. How We Use Your Information</h3>
              <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you about updates and features, and to personalize your experience with PostkAR.</p>

              <h3>3. Information Sharing</h3>
              <p>We do not sell your personal information. We may share your information with service providers who assist us in operating our platform, or when required by law.</p>

              <h3>4. Data Security</h3>
              <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>

              <h3>5. Your Rights</h3>
              <p>You have the right to access, correct, or delete your personal information. You may also opt-out of marketing communications at any time.</p>

              <h3>6. Cookies and Tracking</h3>
              <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve user experience.</p>

              <h3>7. Children's Privacy</h3>
              <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>

              <h3>8. Changes to Privacy Policy</h3>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

              <h3>9. Contact Us</h3>
              <p>If you have questions about this Privacy Policy, please contact us through our official communication channels.</p>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}