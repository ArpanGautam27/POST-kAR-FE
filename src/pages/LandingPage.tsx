import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ShoppingCart, Phone, Mail, MapPin } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';
import { ProfileDropdown } from '../components/auth/ProfileDropdown';
import ProductGrid from '../components/product/ProductGrid';
import { ProductService } from '../services/ProductService';
import { MockProductService } from '../services/MockProductService';
import { config } from '../config/environment';
import type { Product } from '../types';
import cf1 from '../assets/customer_feedback_1.mp4';
import cf2 from '../assets/customer_feedback_2.mp4';
import cf3 from '../assets/customer_feedback_3.mp4';
import cf4 from '../assets/customer_feedback_4.mp4';
import cf5 from '../assets/customer_feedback_5.mp4';
import cf6 from '../assets/customer_feedback_6.mp4';
import cf7 from '../assets/customer_feedback_7.mp4';
import cf8 from '../assets/customer_feedback_8.mp4';
import cf9 from '../assets/customer_feedback_9.mp4';
import cf10 from '../assets/customer_feedback_10.mp4';
import cf11 from '../assets/customer_feedback_11.mp4';
import headerLogoVideo from '../assets/logo_new.mp4';
import heroSectionHeader from '../assets/hero_section_header.mp4';
import xLogo from '../assets/x_logo.svg';
import instagramLogo from '../assets/instagram_logo.svg';
import linkedinLogo from '../assets/linkedin_logo.svg';
import './LandingPage.css';

// Simple drag-to-scroll hook
function useDragScroll(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      el.classList.add('dragging');
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      el.classList.remove('dragging');
    };

    const onMouseUp = () => {
      isDown = false;
      el.classList.remove('dragging');
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1; // scroll speed multiplier
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('mouseup', onMouseUp);
    el.addEventListener('mousemove', onMouseMove);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('mousemove', onMouseMove);
    };
  }, [ref]);
}

export default function LandingPage() {
  const { totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Cinematic scroll states
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePanel, setActivePanel] = useState(0);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const feedbackVideos = [cf8, cf1, cf2, cf3, cf4, cf5, cf6, cf7, cf9, cf10, cf11];
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [muted, setMuted] = useState<boolean[]>(() => feedbackVideos.map(() => true));

  // Apply drag scroll to horizontal sections
  useDragScroll(spotlightRef);
  useDragScroll(servicesRef);

  const toggleMute = (idx: number) => {
    setMuted(prev => {
      const next = prev.map(() => true);
      const willUnmute = prev[idx]; // if previously muted, we will unmute this one
      if (willUnmute) {
        next[idx] = false; // unmute selected
      } else {
        next[idx] = true; // toggle back to muted
      }

      // Apply to DOM refs: ensure only one is unmuted
      videoRefs.current.forEach((v, i) => {
        if (!v) return;
        const shouldMute = next[i];
        v.muted = shouldMute;
        if (!shouldMute) {
          v.play().catch(() => {});
        }
      });

      return next;
    });
  };

  // ALL SLIDES - Updated to include everything
  const cinematicPanels = [
    // Slide 1 - Hero
    {
      id: 'hero1',
      heading: 'POST-kAR',
      subtitle: '"Beyond The Frame: Link your clicks"',
      description: 'Experience Culture Through Augmented Reality',
    },
    // Slide 2 - Hero 2
    {
      id: 'hero2',
      heading: 'Scan. Discover. Interact.',
      subtitle: 'Transform posters into living stories',
      description: 'Augment any poster with immersive experiences',
    },
    // Slide 3 - Hero 3
    {
      id: 'hero3',
      heading: 'Beyond The Frame: Link your clicks',
      subtitle: 'Turning culture into AR moments',
      description: 'Experience culture through augmented reality. Preserve tradition with modern technology.',
    },
    // Slide 4 - Features Title
    {
      id: 'features-title',
      heading: 'Key Features',
      subtitle: 'What makes PostkAR special',
      description: '',
    },
    // Slide 5 - Feature 1
    {
      id: 'feature1',
      heading: 'Marker-Based AR',
      subtitle: '⚡',
      description: 'Scan posters, artworks, and photos to unlock dynamic, interactive AR content instantly.',
    },
    // Slide 6 - Feature 2
    {
      id: 'feature2',
      heading: 'Hybrid Platform',
      subtitle: '🌍',
      description: 'Combines streaming, gaming, and a digital marketplace for collectibles in one experience.',
    },
    // Slide 7 - Feature 3
    {
      id: 'feature3',
      heading: 'Cultural Storytelling',
      subtitle: '✨',
      description: 'Experience art, culture, and stories in an engaging, modern way that preserves tradition.',
    },
    // Slide 8 - CTA
    {
      id: 'cta',
      heading: 'Experience POST-kAR',
      subtitle: '',
      description: 'Discover our AR-enabled products and start your augmented reality journey today.',
    },
    // Slide 9 - About
    {
      id: 'about',
      heading: 'About NitiNex Studio',
      subtitle: 'Founded by Akash Negi',
      description: 'An AR/VR-focused startup specializing in immersive digital experiences. PostkAR blends tradition with technology, making cultural storytelling more interactive and accessible.',
    },
  ];

  const totalPanels = cinematicPanels.length; // 9 slides
  // Products for home
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const productService = config.enableMockData ? MockProductService.getInstance() : ProductService.getInstance();

  useEffect(() => {
    // Load first 6 products for the home page (featured products)
    (async () => {
      try {
        setLoadingProducts(true);
        let data = await productService.getProducts();
        // Always show first 6 products as featured on landing page
        setProducts(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (e) {
        if (config.enableMockData) {
          const mock = MockProductService.getInstance();
          const data = await mock.getProducts();
          // Always show first 6 products as featured on landing page
          setProducts(Array.isArray(data) ? data.slice(0, 6) : []);
        } else {
          setProducts([]);
        }
      } finally {
        setLoadingProducts(false);
      }
    })();
    // Reveal-on-scroll animations
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    const handleScroll = () => {
      const heroSection = document.getElementById('cinematic-hero');
      if (!heroSection) return;
      const nav = document.querySelector('.landing-nav') as HTMLElement | null;
      const navH = nav ? nav.clientHeight : 0;

      const rect = heroSection.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY; // absolute document Y for section top
      const sectionHeight = heroSection.offsetHeight;
      const windowHeight = window.innerHeight;
      const effectiveViewport = Math.max(windowHeight - navH, 1);

      const start = Math.max(sectionTop - navH, 0);
      const end = Math.max(sectionTop + sectionHeight - effectiveViewport, start + 1);
      const y = window.scrollY;

      if (y >= start && y <= end) {
        const denom = end - start || 1;
        const progress = (y - start) / denom;
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
        const idx = Math.min(
          Math.floor(progress * totalPanels),
          totalPanels - 1
        );
        setActivePanel(idx);
      } else if (y < start) {
        setScrollProgress(0);
        setActivePanel(0);
      } else if (y > end) {
        setScrollProgress(1);
        setActivePanel(totalPanels - 1);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      io.disconnect();
    };
  }, [totalPanels]);

  const translateVW = -(scrollProgress * (totalPanels - 1) * 100);

  return (
    <div className="app">
      {/* Navigation Bar */}
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
              onLoadedData={(e) => e.currentTarget.setAttribute('data-loaded', 'true')}
            />
          </Link>
          <div className="nav-links">
            <Link to="/free-experience" className="nav-link">Free Experience</Link>
            <Link to="/products" className="nav-link">Products</Link>
            <a href="/scanner/scan_mind.html" className="nav-link scanner-only" target="_blank" rel="noopener noreferrer">Scanner</a>
            <Link to="/cart" className="nav-link nav-cart-link" style={{ display: 'none' }}>
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </Link>
            <div style={{ display: 'none' }}>
              {isAuthenticated ? (
                <ProfileDropdown />
              ) : (
                <button className="nav-login-button" onClick={() => setIsAuthModalOpen(true)}>
                  <LogIn size={16} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Top Image Slider */}
      <div className="image-strip">
        <div className="image-strip__track">
          <div className="image-strip__item" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80)` }} />
          <div className="image-strip__item" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1520975922284-9bcd8dac1512?w=1200&q=80)` }} />
          <div className="image-strip__item" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80)` }} />
          <div className="image-strip__item" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1496302662116-35cc4f36df92?w=1200&q=80)` }} />
          <div className="image-strip__item" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=1200&q=80)` }} />
          {/* duplicate for seamless loop */}
          <div className="image-strip__item" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80)` }} />
          <div className="image-strip__item" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1520975922284-9bcd8dac1512?w=1200&q=80)` }} />
          <div className="image-strip__item" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80)` }} />
          <div className="image-strip__item" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1496302662116-35cc4f36df92?w=1200&q=80)` }} />
          <div className="image-strip__item" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=1200&q=80)` }} />
        </div>
      </div>

      {/* Minimal Hero Section: video only */}
      <header className="hero hero--video-only" style={{ padding: 0 }}>
        <video
          className="hero-header-video"
          src={heroSectionHeader}
          muted
          loop
          playsInline
          autoPlay
        />
      </header>
      <header className="hero" style={{ display: 'none' }}>
        <div className="hero-inner">
          <h1 className="hero-title">post-kAR</h1>
          <p className="hero-subtitle">Beyond The Frame</p>
          <p className="hero-desc">Link your clicks</p>
        </div>
        <div className="hero-bg" />
      </header>

      {/* Community Spotlight: Video Stories */}
      <section className="section section-video-reviews reveal in" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="card" style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 12, padding: '1rem', position: 'relative', overflow: 'visible' }}>
            <div className="section-head" style={{ marginBottom: '1rem' }}>
              <h2 className="section-title">Community Spotlight</h2>
            </div>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                aria-label="Scroll left"
                onClick={() => spotlightRef.current?.scrollBy({ left: -((spotlightRef.current?.clientWidth || 0) * 0.8), behavior: 'smooth' })}
                style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'rgba(255,255,255,0.18)', color: '#ddd', border: 'none', width: 36, height: 36, borderRadius: 18, cursor: 'pointer' }}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Scroll right"
                onClick={() => spotlightRef.current?.scrollBy({ left: +((spotlightRef.current?.clientWidth || 0) * 0.8), behavior: 'smooth' })}
                style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'rgba(255,255,255,0.18)', color: '#ddd', border: 'none', width: 36, height: 36, borderRadius: 18, cursor: 'pointer' }}
              >
                ›
              </button>
              <div
                ref={spotlightRef}
                className="video-cards"
                style={{ WebkitOverflowScrolling: 'touch' as any }}
              >
                {feedbackVideos.map((src, idx) => (
                  <div key={idx} className="video-card" style={{ background: '#111', borderRadius: 12, overflow: 'hidden', position: 'relative', aspectRatio: '2 / 3', boxShadow: '0 6px 24px rgba(0,0,0,0.25)' }}>
                    <video
                      ref={(el) => { if (el) videoRefs.current[idx] = el; }}
                      src={src}
                      muted={muted[idx]}
                      loop
                      playsInline
                      autoPlay
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => toggleMute(idx)}
                      aria-label={muted[idx] ? 'Unmute video' : 'Mute video'}
                      style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', width: 34, height: 34, borderRadius: 17, cursor: 'pointer', display: 'grid', placeItems: 'center', backdropFilter: 'blur(6px)' as any }}
                    >
                      {muted[idx] ? '🔇' : '🔊'}
                    </button>
                    <div style={{ position: 'absolute', left: 12, bottom: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '6px 10px', borderRadius: 999, fontSize: 12 }}>#postkar</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products (from catalog) */}
      <section className="section section-products reveal in">
        <div className="container">
          <div className="card" style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 12, padding: '1rem', overflow: 'visible' }}>
            <div className="section-head" style={{ marginBottom: '1rem' }}>
              <h2 className="section-title">Featured Products</h2>
            </div>
            <ProductGrid 
              products={products} 
              loading={loadingProducts} 
              onProductClick={(id) => { window.location.href = `/product/${id}`; }}
              horizontal={true}
              showArrows={true}
              cardProps={{ comingSoon: true, hideCart: true, hidePrice: true }}
            />
          </div>
        </div>
      </section>

{/* Services Section (Netflix-style scroll) */}
<section className="section section-services reveal in">
  <div className="container">
    <div
      className="card"
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: 'none',
        borderRadius: 12,
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <h2 className="section-title">Services</h2>

      {/* Horizontal Scrollable Cards */}
      <div ref={servicesRef} className="services-scroll">
        {[
          {
            title: 'Custom AR Campaigns',
            meta: 'Branded AR experiences for culture & retail',
          },
          {
            title: 'Creator Tools',
            meta: 'Upload artworks and publish AR layers',
          },
          {
            title: 'Mobile App',
            meta: 'Native app for scanning & collectibles',
          },
          {
            title: 'Virtual Tours',
            meta: 'Interactive 3D & VR experiences for spaces',
          },
          {
            title: 'Mixed Reality',
            meta: 'Blend real and virtual worlds seamlessly',
          },
        ].map((service, i) => (
          <div
            key={i}
            className="card service-card"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: 12,
              flex: '0 0 auto',
            }}
          >
            <div className="card-body">
              <h3 className="card-title">{service.title}</h3>
              <p className="card-meta">{service.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>




      {/* Reviews removed as requested */}

      {/* Cinematic Hero Section - ALL SLIDES (hidden for minimal landing) */}
      {false && (
      <section
        id="cinematic-hero"
        className="cinematic-hero-section"
        ref={containerRef}
        style={{ height: `${totalPanels * 100}vh` }}
      >
        <div className="scroll-indicator">
          <span className="scroll-text">SCROLL</span>
          <div className="scroll-line">
            <div 
              className="scroll-progress-fill"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
        </div>

        <div className="cinematic-viewport">
          <div 
            className="cinematic-panels-container"
            style={{ width: `${totalPanels * 100}vw`, transform: `translateX(${translateVW}vw)` }}
          >
            {cinematicPanels.map((panel, index) => {
              const isActive = activePanel === index;
              const isPast = activePanel > index;
              
              return (
                <div key={panel.id} className="cinematic-panel">
                  {/* Background - you can add different backgrounds per slide */}
                  <div 
                    className="panel-background"
                    style={{
                      backgroundColor: '#0a1128', // Dark blue background
                      transform: isActive ? 'scale(1)' : 'scale(1.1)',
                      filter: isPast ? 'brightness(0.5)' : 'brightness(0.8)'
                    }}
                  />
                  
                  <div className="panel-overlay" />
                  
                  <div 
                    className="panel-content"
                    style={{
                      opacity: isActive ? 1 : 0.3,
                      transform: isActive ? 'translateY(0)' : 'translateY(50px)'
                    }}
                  >
                    <h1 className="panel-heading">{panel.heading}</h1>
                    <p className="panel-subtitle">{panel.subtitle}</p>
                    {panel.description && (
                      <p className="panel-description">{panel.description}</p>
                    )}
                    
                    {/* Show CTA button on slide 8 */}
                    {panel.id === 'cta' && (
                      <Link to="/products" className="submit-btn" style={{ marginTop: '2rem' }}>
                        Explore Products
                      </Link>
                    )}
                    
                    <div 
                      className="panel-line"
                      style={{ width: isActive ? '96px' : '0px' }}
                    />
                  </div>

                  <div className="panel-number">
                    {String(index + 1).padStart(2, '0')} / {String(totalPanels).padStart(2, '0')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="cinematic-progress-bar">
          <div 
            className="cinematic-progress-fill"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </section>
      )}

      {/* Contact Section - Keep this below slides */}
      <section className="contact-section" style={{ display: 'none' }}>
        <div className="container">
          <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, textAlign: 'center', marginBottom: '1rem', color: '#1a1a1a' }}>Get In Touch</h2>
          <p className="section-subtitle" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: '#666', textAlign: 'center', marginBottom: '6rem' }}>Connect with us</p>
          <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div className="contact-card" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', padding: '3rem 2.5rem', textAlign: 'center' }}>
              <div className="contact-icon" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📞</div>
              <h3 className="contact-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1a1a1a' }}>Official Contact</h3>
              <a href="tel:+917579122216" className="contact-link" style={{ color: '#666', textDecoration: 'none', fontSize: '1.05rem' }}>+91 7579122216</a>
            </div>

            <div className="contact-card" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', padding: '3rem 2.5rem', textAlign: 'center' }}>
              <div className="contact-icon" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✉️</div>
              <h3 className="contact-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1a1a1a' }}>Official Mail</h3>
              <a href="mailto:postkar.info@gmail.com" className="contact-link" style={{ color: '#666', textDecoration: 'none', fontSize: '1.05rem' }}>postkar.info@gmail.com</a>
            </div>

            <div className="contact-card" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: '24px', padding: '3rem 2.5rem', textAlign: 'center' }}>
              <div className="contact-icon" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📍</div>
              <h3 className="contact-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1a1a1a' }}>Office Address</h3>
              <p className="contact-link" style={{ color: '#666', cursor: 'default', fontSize: '1.05rem', lineHeight: 1.7 }}>
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
            &copy; 2025 NitiNex Studio. All rights reserved.
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

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}