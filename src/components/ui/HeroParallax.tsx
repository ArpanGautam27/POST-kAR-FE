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
  // State for random image rotation
  const [displayProducts, setDisplayProducts] = useState<any[]>([]);
  const [flippingIndices, setFlippingIndices] = useState<Set<number>>(new Set());

  // Update displayProducts when products prop changes
  useEffect(() => {
    const extendedProducts = [
      ...products.map(p => ({ ...p, uniqueId: `${p.id}-0` })),
      ...products.map(p => ({ ...p, uniqueId: `${p.id}-1` })),
      ...products.map(p => ({ ...p, uniqueId: `${p.id}-2` })),
    ];
    setDisplayProducts(extendedProducts);
  }, [products]);

  // Randomly change 2-3 images every 2 seconds
  useEffect(() => {
    if (products.length === 0 || displayProducts.length === 0) return;

    const interval = setInterval(() => {
      // Select 2-3 random indices to flip
      const numToFlip = Math.floor(Math.random() * 2) + 2; // 2 or 3
      const indicesToFlip = new Set<number>();
      
      while (indicesToFlip.size < numToFlip && indicesToFlip.size < displayProducts.length) {
        const randomIndex = Math.floor(Math.random() * displayProducts.length);
        indicesToFlip.add(randomIndex);
      }

      // Mark cards as flipping
      setFlippingIndices(indicesToFlip);

      // After flip animation (500ms), update the images
      setTimeout(() => {
        setDisplayProducts(prev => {
          const newProducts = [...prev];
          indicesToFlip.forEach(index => {
            // Get current image ID to avoid picking the same one
            const currentImageId = prev[index].id;
            
            // Pick a different random image (not the same as current)
            let randomProduct;
            let attempts = 0;
            do {
              randomProduct = products[Math.floor(Math.random() * products.length)];
              attempts++;
              // Prevent infinite loop if only one product exists
              if (attempts > 10 || products.length === 1) break;
            } while (randomProduct.id === currentImageId);
            
            const suffix = prev[index].uniqueId.split('-')[1];
            newProducts[index] = {
              ...randomProduct,
              uniqueId: `${randomProduct.id}-${suffix}-${Date.now()}`
            };
          });
          return newProducts;
        });
        setFlippingIndices(new Set());
      }, 500);
    }, 2000); // Changed to 2 seconds

    return () => clearInterval(interval);
  }, [products, displayProducts.length]);

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
          {displayFirstRow.map((product, index) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.uniqueId}
              isFlipping={flippingIndices.has(index)}
            />
          ))}
        </motion.div>
        <motion.div className="hero-parallax-grid">
          {displaySecondRow.map((product, index) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.uniqueId}
              isFlipping={flippingIndices.has(index + 8)}
            />
          ))}
        </motion.div>
        <motion.div className="hero-parallax-grid">
          {displayThirdRow.map((product, index) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.uniqueId}
              isFlipping={flippingIndices.has(index + 16)}
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
  isFlipping = false,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
  isFlipping?: boolean;
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
        <motion.div
          animate={{
            rotateY: isFlipping ? 180 : 0,
            scale: isFlipping ? 0.95 : 1,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <img
            src={product.thumbnail}
            className="hero-parallax-card-image"
            alt={product.title}
            style={{
              backfaceVisibility: "hidden",
            }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};
