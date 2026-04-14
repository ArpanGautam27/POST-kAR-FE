import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  quote?: string;
  name?: string;
  designation?: string;
  src: string;
  isVideo?: boolean;
  muted?: boolean;
}

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
}

export const AnimatedTestimonials: React.FC<AnimatedTestimonialsProps> = ({
  testimonials,
  autoplay = true
}) => {
  const [active, setActive] = useState(0);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (autoplay && testimonials.length > 0 && isInView) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, active, isInView]);

  // If we have no testimonials, render nothing to avoid runtime errors
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Ensure active index is always within bounds
  const safeIndex = Math.min(Math.max(active, 0), testimonials.length - 1);

  return (
    <div className="animated-testimonials-container" ref={containerRef}>
      <div className="testimonials-content">
        <div className="testimonials-grid">
          <AnimatePresence mode="wait">
            <motion.div
              key={safeIndex}
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: -40,
              }}
              transition={{
                duration: 0.4,
                ease: 'easeInOut',
              }}
              className="testimonial-card"
              style={{
                position: 'absolute',
                inset: 0,
              }}
            >
              {testimonials[safeIndex].isVideo ? (
                <video
                  ref={(el) => {
                    if (el) {
                      if (isInView) {
                        el.play().catch(() => { });
                      } else {
                        el.pause();
                      }
                    }
                  }}
                  src={testimonials[safeIndex].src}
                  loop
                  muted={testimonials[safeIndex].muted !== false}
                  playsInline
                  className="testimonial-media"
                />
              ) : (
                <img
                  src={testimonials[safeIndex].src}
                  alt={testimonials[safeIndex].name || 'Testimonial'}
                  className="testimonial-media"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="testimonials-nav">
          <button onClick={handlePrev} className="nav-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={handleNext} className="nav-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .animated-testimonials-container {
          max-width: 100%;
          width: 100%;
          position: relative;
        }

        .testimonials-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          position: relative;
        }

        .testimonials-grid {
          position: relative;
          height: 500px;
          width: 100%;
          perspective: 1000px;
        }

        .testimonial-card {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .testimonial-media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .testimonials-nav {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .nav-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .nav-button svg {
          width: 20px;
          height: 20px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .testimonials-grid {
            height: 400px;
          }

          .nav-button {
            width: 40px;
            height: 40px;
          }

          .nav-button svg {
            width: 16px;
            height: 16px;
          }
        }

        @media (max-width: 480px) {
          .testimonials-grid {
            height: 350px;
          }

          .testimonials-content {
            gap: 1.5rem;
          }

          .nav-button {
            width: 36px;
            height: 36px;
          }

          .nav-button svg {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </div>
  );
};
