import { useState, useRef } from 'react';
import type { HeroImage } from '../../services/HeroService';
import './HeroSection.css';

interface HeroSectionProps {
  heroImages: HeroImage[];
  wallsCount: number;
}

export default function HeroSection({ heroImages, wallsCount }: HeroSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Promotional offers for the ticker
  const offers = [
    'PREPAID ORDERS!',
    'BUY 4 GET 3 FREE!',
    'BUY 5 GET 5 FREE!',
    'BUY 6 GET 12 FREE!',
    'BUY 10 GET 20 FREE!',
    'BUY 20 GET 50 FREE!',
    'FREE DELIVERY FOR PREPAID ORDERS!',
    '➜ FREE DELIVERY FOR PREPAID ORDERS'
  ];

  // Drag scroll functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="hero-section">
      {/* Promotional Ticker */}
      <div className="promotional-ticker">
        <div className="ticker-content">
          {[...offers, ...offers].map((offer, index) => (
            <span key={index} className="ticker-item">
              {offer}
            </span>
          ))}
        </div>
      </div>

      {/* Hero Content */}
      <div className="hero-content-wrapper">
        <div className="hero-text">
          <h1 className="hero-heading">
            TRANSFORMED OVER <span className="highlight-count">{wallsCount.toLocaleString()}+</span> WALLS.
          </h1>
          <p className="hero-subheading">Experience Culture Through Augmented Reality</p>
          <p className="hero-description">
            Scan. Discover. Interact. Transform your space with AR-enabled posters that bring art to life.
          </p>
        </div>

        {/* Customer Gallery */}
        <div
          className="customer-gallery"
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="gallery-track">
            {heroImages.map((image) => (
              <div key={image.id} className="gallery-item">
                <img
                  src={image.imageUrl}
                  alt={image.title || 'Customer wall transformation'}
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <span className="ar-badge">AR Enabled</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="gallery-hint">
          <span>← Drag to explore customer transformations →</span>
        </div>
      </div>
    </section>
  );
}
