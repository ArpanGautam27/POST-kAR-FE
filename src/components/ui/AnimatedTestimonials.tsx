import React, { useState, useEffect } from 'react';
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

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, active]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="animated-testimonials-container">
      <div className="testimonials-content">
        <div className="testimonials-grid">
          <AnimatePresence>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: index === active ? 1 : 0.7,
                  scale: index === active ? 1 : 0.95,
                  z: index === active ? 0 : -100,
                  rotate: index === active ? 0 : randomRotateY(),
                  zIndex: index === active ? 999 : testimonials.length - Math.abs(index - active),
                  y: index === active ? [0, -80, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="testimonial-card"
                style={{
                  position: 'absolute',
                  inset: 0,
                }}
              >
                {testimonial.isVideo ? (
                  <video
                    src={testimonial.src}
                    autoPlay
                    loop
                    muted={testimonial.muted !== false}
                    playsInline
                    className="testimonial-media"
                  />
                ) : (
                  <img
                    src={testimonial.src}
                    alt={testimonial.name || 'Testimonial'}
                    className="testimonial-media"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="testimonials-nav">
          <button onClick={handlePrev} className="nav-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button onClick={handleNext} className="nav-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
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
      `}</style>
    </div>
  );
};
