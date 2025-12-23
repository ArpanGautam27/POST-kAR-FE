"use client";
import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";
import GradientText from "./GradientText";
import { EncryptedText } from "./encrypted-text";

export const HeroParallax = ({
  products,
}: {
  products: {
    id: string;
    title: string;
    link: string;
    thumbnail: string;
  }[];
}) => {
  // State for card display
  const [displayProducts, setDisplayProducts] = useState<any[]>([]);

  // Helper function to create unique shuffled array with no duplicates
  const createUniqueShuffledArray = (sourceProducts: any[], targetLength: number): any[] => {
    const result: any[] = [];
    const timestamp = Date.now();
    
    // If we have enough unique products, use them without duplicates
    if (sourceProducts.length >= targetLength) {
      const shuffled = [...sourceProducts].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, targetLength).map((p, idx) => ({
        ...p,
        uniqueId: `${p.id}-${idx}-${timestamp}-${Math.random()}`
      }));
    }
    
    // If not enough products, distribute them evenly to minimize consecutive duplicates
    const usedIds: string[] = [];
    let productPool = [...sourceProducts].sort(() => Math.random() - 0.5);
    
    while (result.length < targetLength) {
      if (productPool.length === 0) {
        // Reshuffle when pool is empty
        productPool = [...sourceProducts].sort(() => Math.random() - 0.5);
      }
      
      const product = productPool.shift()!;
      const lastId = usedIds[usedIds.length - 1];
      
      // Try to avoid consecutive duplicates
      if (usedIds.length < 2 || product.id !== lastId || sourceProducts.length === 1) {
        result.push({
          ...product,
          uniqueId: `${product.id}-${result.length}-${timestamp}-${Math.random()}`
        });
        usedIds.push(product.id);
      } else {
        // Put back and try next
        productPool.push(product);
      }
    }
    
    return result;
  };

  // Update displayProducts when products prop changes
  useEffect(() => {
    if (products.length === 0) return;
    setDisplayProducts(createUniqueShuffledArray(products, 24));
  }, [products]);

  const displayFirstRow = displayProducts.slice(0, 8);
  const displaySecondRow = displayProducts.slice(8, 16);
  const displayThirdRow = displayProducts.slice(16, 24);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="hero-parallax-container"
      style={{
        paddingTop: "4rem",
        paddingBottom: "20rem",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="hero-parallax-grid">
          {displayFirstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.uniqueId}
            />
          ))}
        </motion.div>
        <motion.div className="hero-parallax-grid">
          {displaySecondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.uniqueId}
            />
          ))}
        </motion.div>
        <motion.div className="hero-parallax-grid">
          {displayThirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.uniqueId}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="hero-parallax-header">
      <h1 className="hero-parallax-title">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          showBorder={false}
        >
          POST-kAR
        </GradientText>
      </h1>
      <p className="hero-parallax-subtitle">
        <EncryptedText
          text="Beyond The Frame: Link your clicks"
          encryptedClassName="text-neutral-500"
          revealedClassName="text-white"
          revealDelayMs={100}
        />
      </p>
      <p className="hero-parallax-description">
        <EncryptedText
          text="Experience Culture Through Augmented Reality"
          encryptedClassName="text-neutral-600"
          revealedClassName="text-neutral-300"
          revealDelayMs={500}
        />
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      className="hero-parallax-card"
    >
      <Link
        to={product.link}
        className="hero-parallax-card-link"
      >
        <div>
          <img
            src={product.thumbnail}
            className="hero-parallax-card-image"
            alt={product.title}
            style={{
              backfaceVisibility: "hidden",
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
};
