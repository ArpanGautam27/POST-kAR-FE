import React from 'react';
import { motion } from 'framer-motion';
import './ParallaxSection.css';

interface ParallaxSectionProps {
  children: React.ReactNode;
  gradient: string;
  index?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  children, 
  gradient,
  index = 0
}) => {
  // Simplified - removed scale animation to reduce lag
  return (
    <motion.section
      className="parallax-section"
      style={{
        background: gradient,
        position: 'sticky',
        top: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: index + 1
      }}
    >
      <div className="parallax-content">
        {children}
      </div>
    </motion.section>
  );
};

interface SectionCardProps {
  tag: string;
  title: string;
  description: string;
  visual: React.ReactNode;
  reverse?: boolean;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  tag,
  title,
  description,
  visual,
  reverse = false
}) => {
  return (
    <div className="section-card" data-reverse={reverse}>
      <div className="section-card__content">
        <div className="section-card__tag">
          {tag}
        </div>
        <h2 className="section-card__title">
          {title}
        </h2>
        <p className="section-card__description">
          {description}
        </p>
      </div>
      <div className="section-card__visual">
        {visual}
      </div>
    </div>
  );
};
