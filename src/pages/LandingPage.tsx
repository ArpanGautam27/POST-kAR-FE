import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';
import Navigation from '../components/layout/Navigation';
import { ProductService } from '../services/ProductService';
import { HeroService } from '../services/HeroService';
import { CommunityVideoService } from '../services/CommunityVideoService';
import { OffersService } from '../services/OffersService';
import type { Product } from '../types';
import type { HeroImage } from '../services/HeroService';
import type { Offer } from '../services/OffersService';
import Mascot from '../components/common/Mascot';
import xLogo from '../assets/x_logo.svg';
import instagramLogo from '../assets/instagram_logo.svg';
import linkedinLogo from '../assets/linkedin_logo.svg';
import lovePng from '../assets/love.png';
import indianFlagAnim from '../assets/indian_flag.json?url';
import './LandingPage.css';

// Import new home components
import HeroSection from '../components/home/HeroSection';
import OffersBanner from '../components/home/OffersBanner';
import CollectionsSection from '../components/home/CollectionsSection';
import ProductsGridSection from '../components/home/ProductsGridSection';
import CustomProductsSection from '../components/home/CustomProductsSection';
import CommunitySpotlight from '../components/home/CommunitySpotlight';

export default function LandingPage() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [feedbackVideos, setFeedbackVideos] = useState<string[]>([]);
  const [muted, setMuted] = useState<boolean[]>([]);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);

  const productService = ProductService.getInstance();
  const heroService = HeroService.getInstance();
  const communityVideoService = CommunityVideoService.getInstance();
  const offersService = OffersService.getInstance();

  // Static wall count for hero (can be dynamic from API)
  const wallsCount = 2500;

  useEffect(() => {
    // Load community videos from Cloudflare
    (async () => {
      try {
        const videos = await communityVideoService.getCommunityVideos();
        setFeedbackVideos(videos);
        setMuted(videos.map(() => true));
      } catch (e) {
        console.error('Error loading community videos:', e);
        setFeedbackVideos([]);
        setMuted([]);
      }
    })();

    // Load hero images
    (async () => {
      try {
        console.log('[LandingPage] Loading hero images...');
        const response = await heroService.getHeroImages();
        console.log('[LandingPage] Hero images response:', response);
        if (response.success && response.data) {
          console.log('[LandingPage] Loaded', response.data.length, 'hero images');
          setHeroImages(response.data);
        } else {
          console.warn('[LandingPage] Failed to load hero images:', response.error);
          setHeroImages([]);
        }
      } catch (e) {
        console.error('[LandingPage] Error loading hero images:', e);
        setHeroImages([]);
      }
    })();

    // Load products for the grid
    (async () => {
      try {
        let data = await productService.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error loading products:', e);
        setProducts([]);
      }
    })();

    // Load offers from backend
    (async () => {
      try {
        console.log('[LandingPage] Loading offers...');
        const response = await offersService.getOffers();
        if (response.success && response.data) {
          console.log('[LandingPage] Loaded', response.data.length, 'offers');
          setOffers(response.data);
        } else {
          console.warn('[LandingPage] Failed to load offers:', response.error);
          setOffers([]);
        }
      } catch (e) {
        console.error('[LandingPage] Error loading offers:', e);
        setOffers([]);
      }
    })();
  }, []);

  return (
    <div className="app" style={{ background: '#fff', minHeight: '100vh' }}>
      <Navigation />

      {/* New Section-Based Layout */}

      {/* 1. Hero Section - Promotional Ticker + Social Proof + Customer Gallery */}
      <HeroSection heroImages={heroImages} wallsCount={wallsCount} />

      {/* 2. Offers Banner - Auto-scrolling promotional offers */}
      <OffersBanner offers={offers} />

      {/* 3. Collections Section - Circular Category Cards */}
      <CollectionsSection />

      {/* 4. Products Grid Section - Best Selling Products */}
      <ProductsGridSection products={products} />

      {/* 5. Community Spotlight - Clean minimal design */}
      <CommunitySpotlight feedbackVideos={feedbackVideos} muted={muted} />

      {/* 6. Custom Products Section - Design Your Own */}
      <CustomProductsSection />

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
              <p className="footer-title">Contact</p>
              <div className="footer-links">
                <a href="tel:+917579122216" className="footer-link-with-icon">
                  <Phone size={16} />
                  <span>+91 7579122216</span>
                </a>
                <a href="mailto:postkar.info@gmail.com" className="footer-link-with-icon">
                  <Mail size={16} />
                  <span>postkar.info@gmail.com</span>
                </a>
                <span className="footer-link-with-icon">
                  <MapPin size={16} />
                  <span>Engineer's Enclave, GMS Rd, Kanwali, Dehradun, Uttarakhand 248171</span>
                </span>
                <span className="footer-link-with-icon" style={{ marginTop: '0.5rem' }}>
                  <MapPin size={16} />
                  <span>Digital Address: Kondapur, Hitech City, Hyderabad</span>
                </span>
              </div>
            </div>
            <div className="footer-col footer-col-social">
              <p className="footer-title">Follow Us</p>
              <div className="footer-links social-links">
                <a href="https://www.instagram.com/post._.kar?igsh=MWNqdGkxazJjM2xhdA==" target="_blank" rel="noopener noreferrer" title="Instagram">
                  <img src={instagramLogo} alt="Instagram" className="social-icon" />
                </a>
                <a href="https://x.com/KarPost71712?t=GO-m45s7DP79vERWDmftLQ&s=09" target="_blank" rel="noopener noreferrer" title="X">
                  <img src={xLogo} alt="X" className="social-icon" />
                </a>
                <a href="https://www.linkedin.com/in/post-kar-02ab1038a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <img src={linkedinLogo} alt="LinkedIn" className="social-icon" />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <div className="footer-made-with">
                <span>Made with</span>
                <img src={lovePng} alt="love" style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle' }} />
                <span>from</span>
                {(() => {
                  const LottiePlayer = 'lottie-player' as any;
                  return (
                    <LottiePlayer
                      src={indianFlagAnim}
                      background="transparent"
                      speed="1"
                      style={{ width: '24px', height: '24px', display: 'inline-block', verticalAlign: 'middle' }}
                      loop
                      autoplay
                    />
                  );
                })()}
              </div>
              <div className="footer-copyright">
                &copy; 2025 NitiNex Studio. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms Modal */}
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

      {/* Privacy Modal */}
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

      {/* === MASCOT === */}
      <Mascot model="home" />

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}