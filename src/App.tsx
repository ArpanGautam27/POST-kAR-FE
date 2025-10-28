<<<<<<< HEAD
import React, { useState } from 'react';
import arVideo from './assets/placeholder.mov';

// SVG IMPORTS (These are correct)
import xLogo from './assets/x_logo.svg';
import instagramLogo from './assets/instagram_logo.svg';
import linkedinLogo from './assets/linkedin_logo.svg';

export default function App() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = () => {
    if (email && phone && name) {
      setSubmitted(true);
      setEmail('');
      setPhone('');
      setName('');
      setTimeout(() => {
        setSubmitted(false);
        setShowModal(false);
      }, 2000);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEmail('');
    setPhone('');
    setName('');
    setSubmitted(false);
  };

  return (
    <div className="app">
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

          {/* 🆕 SCAN BUTTON ADDED HERE */}
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <button
        className="scan-btn"
       onClick={() => window.location.href = '/scanner/scan_mind.html'}

      >
        🔍 Scan with AR
      </button>
    </div>
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
            <h2 className="waitlist-title">Join the Waitlist</h2>
            <p className="waitlist-desc">Be among the first to experience PostkAR. Early supporters get exclusive access and updates.</p>
            <button onClick={() => setShowModal(true)} className="submit-btn">
              Join Waitlist
            </button>
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
                Engineer’s Enclave, F 402,<br />
               GMS Rd, Engineers Enclave, Kanwali, Dehradun, Uttarakhand 248171
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

      {/* Waitlist Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2 className="modal-title">Join Our Waitlist</h2>
            <p className="modal-desc">Fill in your details to get early access</p>

            {submitted ? (
              <div className="success-message">
                <p>✓ Thank you for joining!</p>
                <p style={{fontSize: '14px', marginTop: '8px'}}>We'll contact you soon with exclusive updates.</p>
              </div>
            ) : (
              <div className="modal-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input"
                  />
                </div>

                <button onClick={handleSubmit} className="modal-submit-btn">
                  Join Waitlist
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
          background-color: #ffffff;
          color: #111827;
        }

        .app {
          width: 100%;
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Section */
        .hero-section {
          background-color: #f9fafb;
          padding: 80px 0;
        }

        .logo {
          text-align: center;
          color: #4f46e5;
          font-size: 48px;
          font-weight: bold;
          letter-spacing: 2px;
          margin-bottom: 30px;
        }

        .hero-slogan {
            text-align: center;
            font-size: 20px;
            color: #111827; /* Dark text color */
            font-weight: 500;
            margin-bottom: 30px; /* Space above the main title */
        }

        .hero-title {
          text-align: center;
          font-size: 48px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .hero-subtitle {
          text-align: center;
          font-size: 18px;
          color: #6b7280;
          max-width: 700px;
          margin: 0 auto 40px;
        }

        .hero-video {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          display: block;
        }

        /* Features Section */
        .features-section {
          background-color: #f3f4f6;
          padding: 80px 0;
        }

        .section-title {
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 15px;
        }

        .section-subtitle {
          text-align: center;
          color: #6b7280;
          margin-bottom: 50px;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }

        .feature-card {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 32px;
          margin-bottom: 15px;
        }

        .feature-title {
          font-size: 20px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 10px;
        }

        .feature-desc {
          color: #6b7280;
          line-height: 1.6;
          font-size: 15px;
        }

        /* Waitlist Section */
        .waitlist-section {
          background-color: #ffffff;
          padding: 80px 0;
        }

        .waitlist-box {
          max-width: 600px;
          margin: 0 auto;
          background-color: #f0f4ff;
          padding: 48px;
          border-radius: 24px;
          border: 1px solid #e0e7ff;
          text-align: center;
        }

        .waitlist-title {
          font-size: 32px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 12px;
        }

        .waitlist-desc {
          color: #6b7280;
          margin-bottom: 30px;
          font-size: 15px;
        }

        .submit-btn {
          padding: 12px 32px;
          background-color: #4f46e5;
          color: #ffffff;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
          white-space: nowrap;
        }

        .submit-btn:hover {
          background-color: #4338ca;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

          .scan-btn {
  padding: 14px 36px;
  background-color: #22c55e; /* Green for AR action */
  color: #ffffff;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
}

.scan-btn:hover {
  background-color: #16a34a;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  transform: scale(1.03);
}


        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #6b7280;
          transition: color 0.3s ease;
        }

        .modal-close:hover {
          color: #111827;
        }

        .modal-title {
          font-size: 28px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 8px;
        }

        .modal-desc {
          color: #6b7280;
          margin-bottom: 30px;
          font-size: 15px;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-input {
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .modal-submit-btn {
          padding: 12px 24px;
          background-color: #4f46e5;
          color: #ffffff;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 16px;
          margin-top: 10px;
        }

        .modal-submit-btn:hover {
          background-color: #4338ca;
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .success-message {
          background-color: #dcfce7;
          border: 1px solid #86efac;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          color: #166534;
          font-weight: bold;
        }

        /* Legal Modal */
        .legal-modal {
          max-width: 700px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .legal-content {
          text-align: left;
          color: #374151;
          line-height: 1.6;
        }

        .legal-content h3 {
          color: #111827;
          font-size: 18px;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 12px;
        }

        .legal-content h3:first-child {
          margin-top: 0;
        }

        .legal-content p {
          margin-bottom: 16px;
          font-size: 15px;
        }

        /* About Section */
        .about-section {
          background-color: #f3f4f6;
          padding: 80px 0;
        }

        .about-text {
          text-align: center;
          font-size: 18px;
          color: #6b7280;
          line-height: 1.7;
          max-width: 800px;
          margin: 0 auto;
        }
        
        /* Contact Section (NEW) */
        .contact-section {
          background-color: #ffffff;
          padding: 80px 0;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }

        .contact-card {
          text-align: center;
          background-color: #f9fafb;
          padding: 30px 20px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .contact-icon {
          font-size: 32px;
          margin-bottom: 15px;
        }

        .contact-title {
          font-size: 18px;
          font-weight: bold;
          color: #111827;
          margin-bottom: 10px;
        }

        .contact-link {
          display: block;
          color: #4f46e5;
          text-decoration: none;
          font-size: 16px;
          line-height: 1.5;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .contact-link:hover {
          color: #4338ca;
        }
        
        .contact-card:nth-child(3) .contact-link {
            color: #6b7280; /* Address link should not be purple like email/phone */
        }
        
        /* Footer */
        .footer {
          background-color: #ffffff;
          border-top: 1px solid #e5e7eb;
          padding: 48px 0;
        }

        /* UPDATED: Added Flexbox properties to footer-grid for vertical centering */
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-bottom: 30px;
          text-align: center;
          align-items: center; /* Vertically center the columns relative to each other */
        }

        .footer-col {
          text-align: center;
          display: flex;
          flex-direction: column;
          /* Ensure content within the column is centered. This should already be handled by text-align, but explicitly using flex helps. */
          justify-content: center;
        }

        .footer-brand {
          color: #4f46e5;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .footer-title {
          color: #111827;
          font-weight: bold;
          margin-bottom: 12px;
        }

        .footer-text {
          color: #6b7280;
          font-size: 14px;
        }

        .footer-links {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .footer-links.social-links {
            gap: 30px; /* Increase gap for icons */
            align-items: center; /* Vertically align icons */
        }

        .footer-links a {
          color: #6b7280;
          text-decoration: none;
          transition: color 0.3s ease;
          font-size: 14px;
        }

        /* Styling for the Social Media Images */
        .social-links .social-icon {
            width: 30px;  /* Icon size is now 30px */
            height: 30px; /* Icon size is now 30px */
            display: block;
            transition: transform 0.3s ease;
        }
        
        .social-links a:hover .social-icon {
            transform: scale(1.1); /* Subtle hover effect on the icon */
        }
        
        /* Ensure the other legal links maintain their style */
        .footer-links a:not(.social-links a) {
            color: #6b7280;
            font-size: 14px;
        }
        
        .footer-links a:not(.social-links a):hover {
            color: #4f46e5;
        }


        .footer-bottom {
          border-top: 1px solid #e5e7eb;
          padding-top: 30px;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .logo {
            font-size: 36px;
          }

          .hero-title {
            font-size: 32px;
          }

          .section-title {
            font-size: 28px;
          }

          /* On mobile, columns stack, so vertical centering may not be necessary, but this keeps the structure clean */
          .footer-grid {
              align-items: flex-start; /* Reset or adjust for stacked mobile view */
          }
          
          .modal-content {
            padding: 30px;
          }
        }
      `}</style>
    </div>
  );
=======
import AppRouter from './router/AppRouter';
import './App.css';

export default function App() {
  return <AppRouter />;
>>>>>>> origin/feature/WebApp1.0
}