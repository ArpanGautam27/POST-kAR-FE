import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Keep sections mostly visible with subtle scale for depth
  const scale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0.92, 1, 1, 0.92]
  );

  return (
    <motion.section
      ref={ref}
      style={{
        scale,
        background: gradient,
        position: 'sticky',
        top: 0,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        willChange: 'transform',
        zIndex: index + 1
      }}
    >
      <motion.div className="parallax-content">
        {children}
      </motion.div>
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
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: reverse ? '1fr 1fr' : '1fr 1fr',
      gap: '4rem',
      alignItems: 'center',
      width: '100%'
    }}>
      <div style={{ order: reverse ? 2 : 1 }}>
        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1.5rem',
          borderRadius: '50px',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          fontSize: '0.85rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginBottom: '2rem',
          color: 'rgba(255,255,255,0.9)'
        }}>
          {tag}
        </div>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '800',
          color: '#fff',
          marginBottom: '1.5rem',
          lineHeight: '1.1',
          letterSpacing: '-0.02em'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'rgba(255,255,255,0.8)',
          lineHeight: '1.6',
          maxWidth: '500px'
        }}>
          {description}
        </p>
      </div>
      <div style={{ order: reverse ? 1 : 2 }}>
        {visual}
      </div>
    </div>
  );
};
