import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './ScrollTravelSection.css';

interface ScrollTravelSectionProps {
  children: React.ReactNode;
  index: number;
  totalSections: number;
}

export const ScrollTravelSection: React.FC<ScrollTravelSectionProps> = ({ 
  children, 
  index,
  totalSections
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the entire container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Calculate when this card should be active based on scroll
  const cardStart = index / totalSections;
  const cardEnd = (index + 1) / totalSections;
  
  // Z position: start far, come close, then go past
  const z = useTransform(
    scrollYProgress,
    [cardStart - 0.2, cardStart, cardEnd, cardEnd + 0.2],
    [-1500, 0, 0, 500]
  );
  
  // Opacity: fade in when approaching, fade out when leaving
  const opacity = useTransform(
    scrollYProgress,
    [cardStart - 0.2, cardStart, cardEnd, cardEnd + 0.2],
    [0, 1, 1, 0]
  );
  
  // Scale: small when far, normal when close
  const scale = useTransform(
    scrollYProgress,
    [cardStart - 0.2, cardStart, cardEnd, cardEnd + 0.2],
    [0.6, 1, 1, 1.2]
  );

  return (
    <motion.div
      ref={ref}
      className="travel-section"
      style={{
        opacity,
        scale,
        transform: useTransform(z, (value) => `translateZ(${value}px)`),
        zIndex: totalSections - index
      }}
    >
      {children}
    </motion.div>
  );
};

interface ScrollTravelContainerProps {
  children: React.ReactNode;
}

export const ScrollTravelContainer: React.FC<ScrollTravelContainerProps> = ({ children }) => {
  return (
    <div className="scroll-travel-wrapper">
      <div className="travel-perspective">
        {children}
      </div>
    </div>
  );
};
