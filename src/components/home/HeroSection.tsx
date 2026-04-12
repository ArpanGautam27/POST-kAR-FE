import './HeroSection.css';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.postkar';
const WHATSAPP_NUMBER = '917579122216';

export default function HeroSection() {
  const handleDownloadClick = () => {
    // Track click event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'click', { event_category: 'CTA', event_label: 'Download App - Hero' });
    }
    window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
  };

  const handleExploreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section-new">
      <div className="hero-bg-gradient" aria-hidden="true" />

      <div className="hero-inner-new">
        {/* Eyebrow */}
        <p className="hero-eyebrow">✨ Augmented Reality — Made Simple</p>

        {/* Headline */}
        <h1 className="hero-headline">
          Turn Everyday Objects Into{' '}
          <span className="hero-headline-accent">Living Experiences</span>
        </h1>

        {/* Sub-headline */}
        <p className="hero-subheadline">Beyond The Frame</p>

        {/* Body text */}
        <p className="hero-body">
          Scan Karo, Experience Karo. Scan posters, frames, gifts, and décor to unlock immersive
          Augmented Reality — videos, animations, games, and memories that come alive.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta-row">
          <button
            className="hero-btn-primary"
            onClick={handleDownloadClick}
            id="hero-download-btn"
            aria-label="Download Post-kAR App on Google Play Store"
          >
            <span className="hero-btn-icon">▶</span>
            Download App
          </button>
          <a
            href="#products"
            className="hero-btn-secondary"
            onClick={handleExploreClick}
            id="hero-explore-btn"
            aria-label="Explore Post-kAR Products"
          >
            Explore Products
            <span className="hero-btn-arrow">↓</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="hero-trust-badges">
          <span className="trust-badge">
            <span className="trust-badge-flag">🇮🇳</span>
            Made in India
          </span>
          <span className="trust-badge-divider" aria-hidden="true">·</span>
          <span className="trust-badge">
            <span className="trust-badge-icon">🥽</span>
            No Headset Required
          </span>
        </div>
      </div>

      {/* Decorative floating orbs */}
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />
    </section>
  );
}
