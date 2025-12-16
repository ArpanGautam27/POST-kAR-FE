import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';
import Navigation from '../components/layout/Navigation';
import { ProductService } from '../services/ProductService';
import { HeroService } from '../services/HeroService';
import { CommunityVideoService } from '../services/CommunityVideoService';
import type { Product } from '../types';
import type { HeroImage } from '../services/HeroService';
import Mascot from '../components/common/Mascot';
import { HeroParallax } from '../components/ui/HeroParallax';
import { ParallaxSection, SectionCard } from '../components/ui/ParallaxSection';
import { AnimatedTestimonials } from '../components/ui/AnimatedTestimonials';
import CardSwap, { Card } from '../components/ui/CardSwap';
import Hyperspeed from '../components/ui/Hyperspeed';
import Particles from '../components/ui/Particles';
import Galaxy from '../components/ui/Galaxy';
import Orb from '../components/ui/Orb';
import { OrbitingCircles } from '../components/ui/OrbitingCircles';
import GlassIcons from '../components/ui/GlassIcons';
import { useCounter } from '../hooks/useCounter';
import arFurnitureAnimation from '../assets/AR Furniture Viewer.json';
import studioAnimation from '../assets/studio.json';
import phoneAnimation from '../assets/phone.json';
import xrAnimation from '../assets/xr.json';
import '../components/ui/HeroParallax.css';
import xLogo from '../assets/x_logo.svg';
import instagramLogo from '../assets/instagram_logo.svg';
import linkedinLogo from '../assets/linkedin_logo.svg';
import lovePng from '../assets/love.png';
import indianFlagAnim from '../assets/indian_flag.json?url';
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
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Cinematic scroll states
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activePanel, setActivePanel] = useState(0);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const [feedbackVideos, setFeedbackVideos] = useState<string[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [muted, setMuted] = useState<boolean[]>([]);
  const [fullscreenVideo, setFullscreenVideo] = useState<{ src: string; index: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const communityVideoService = CommunityVideoService.getInstance();

  // Animated counter hooks for community stats
  const visitsCount = useCounter(1200, 2500);
  const activeUsersCount = useCounter(24, 2000);

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
  // Hero images for parallax section
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [displayHeroImages, setDisplayHeroImages] = useState<HeroImage[]>([]);
  // Products for featured section
  const [products, setProducts] = useState<Product[]>([]);
  const productService = ProductService.getInstance();
  const heroService = HeroService.getInstance();

  useEffect(() => {
    // Load community videos from Cloudflare
    (async () => {
      try {
        const videos = await communityVideoService.getCommunityVideos();
        setFeedbackVideos(videos);
        setMuted(videos.map(() => true));
      } catch (e) {
        console.error('Error loading community videos:', e);
        setFeedbackVideos([]);
        setMuted([]);
      }
    })();

    // Load hero images for the parallax section
    (async () => {
      try {
        console.log('[LandingPage] Loading hero images...');
        const response = await heroService.getHeroImages();
        console.log('[LandingPage] Hero images response:', response);
        if (response.success && response.data) {
          console.log('[LandingPage] Loaded', response.data.length, 'hero images');
          setHeroImages(response.data);
          setDisplayHeroImages(response.data);
        } else {
          console.warn('[LandingPage] Failed to load hero images:', response.error);
          setHeroImages([]);
          setDisplayHeroImages([]);
        }
      } catch (e) {
        console.error('[LandingPage] Error loading hero images:', e);
        setHeroImages([]);
        setDisplayHeroImages([]);
      }
    })();

    // Load first 6 products for the home page (featured products)
    (async () => {
      try {
        let data = await productService.getProducts();
        // Always show first 6 products as featured on landing page
        setProducts(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (e) {
        console.error('Error loading products:', e);
        setProducts([]);
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

  // Random image rotation effect - change 2 random images every 3 seconds
  useEffect(() => {
    if (heroImages.length === 0) return;

    const interval = setInterval(() => {
      setDisplayHeroImages(current => {
        const newImages = [...current];
        const randomIndex1 = Math.floor(Math.random() * heroImages.length);
        let randomIndex2 = Math.floor(Math.random() * heroImages.length);
        
        // Ensure we pick 2 different indices
        while (randomIndex2 === randomIndex1 && heroImages.length > 1) {
          randomIndex2 = Math.floor(Math.random() * heroImages.length);
        }
        
        // Replace 2 random positions with different images from heroImages
        const availableIndices = heroImages.map((_, idx) => idx);
        const newImgIdx1 = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        let newImgIdx2 = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        
        while (newImgIdx2 === newImgIdx1 && heroImages.length > 1) {
          newImgIdx2 = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        }
        
        newImages[randomIndex1] = heroImages[newImgIdx1];
        newImages[randomIndex2] = heroImages[newImgIdx2];
        
        return newImages;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [heroImages]);

  // Prepare hero images for HeroParallax (ensure we always have images)
  const heroProducts = displayHeroImages.length > 0 
    ? displayHeroImages.slice(0, 15).map((image) => {
        console.log('[LandingPage] Mapping image:', image.id, image.imageUrl);
        return {
          id: image.id,
          title: image.title || 'Hero Image',
          link: '#',
          thumbnail: image.imageUrl,
        };
      })
    : (() => {
        console.warn('[LandingPage] No hero images, using placeholders');
        return Array(15).fill(null).map((_, i) => ({
          id: `placeholder-${i}`,
          title: `Hero ${i + 1}`,
          link: '#',
          thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80',
        }));
      })();
  
  console.log('[LandingPage] heroProducts prepared:', heroProducts.length, 'items');

  // Ensure we have products for the featured section
  const featuredProducts = products.length > 0 ? products : Array(4).fill(null).map((_, i) => ({
    id: `placeholder-${i}`,
    name: `Poster ${i + 1}`,
    thumbnail_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80',
    image_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80',
  }));

  const translateVW = -(scrollProgress * (totalPanels - 1) * 100);

  return (
    <div className="app" style={{ background: '#000', minHeight: '100vh' }}>
      <Navigation />

      {/* Hero Parallax Section */}
      <HeroParallax products={heroProducts} />

      {/* Stacked Parallax Sections */}
      <div>
        {/* Community Spotlight: Video Stories */}
        <ParallaxSection gradient="linear-gradient(135deg, #000000 0%, #000000 100%)" index={0}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Particles
            particleColors={['#f093fb', '#f5576c']}
            particleCount={window.innerWidth < 768 ? 100 : 200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={window.innerWidth >= 768}
            alphaParticles={false}
            disableRotation={false}
          />
        </div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
        <SectionCard
          tag="Community Spotlight"
          title="See POST-kAR in Action"
          description="Watch how our community brings their spaces to life with augmented reality experiences. Real stories, real transformations."
          visual={
            <AnimatedTestimonials 
              testimonials={feedbackVideos.map((src, idx) => ({
                src,
                isVideo: true,
                muted: muted[idx]
              }))}
              autoplay={true}
            />
          }
        />
        </div>
      </ParallaxSection>

      {/* Featured Products */}
      <ParallaxSection gradient="linear-gradient(135deg, #000000 0%, #000000 100%)" index={1}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <Hyperspeed
            effectOptions={{
              distortion: 'turbulentDistortion',
              length: 400,
              roadWidth: 10,
              islandWidth: 2,
              lanesPerRoad: 4,
              fov: 90,
              colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0xFFFFFF,
                brokenLines: 0xFFFFFF,
                leftCars: [0xD856BF, 0x6750A2, 0xC247AC],
                rightCars: [0x03B3C3, 0x0E5EA5, 0x324555],
                sticks: 0x03B3C3,
              }
            }}
          />
        </div>
        
        {/* Content on top */}
        <div style={{ position: 'relative', zIndex: 1 }}>
        <SectionCard
          tag="Featured Products"
          title="Premium AR Posters"
          description="Discover our curated collection of premium posters. Each design comes to life with augmented reality, telling unique stories."
          reverse={true}
          visual={
            <div className="featured-products-wrapper">
              <CardSwap
                width={350}
                height={400}
                cardDistance={50}
                verticalDistance={60}
                delay={5000}
                pauseOnHover={false}
                easing="elastic"
                onCardClick={(idx) => {
                  const product = featuredProducts.slice(0, 4)[idx];
                  if (product) {
                    window.location.href = `/product/${product.id}`;
                  }
                }}
              >
                {featuredProducts.slice(0, 4).map((product) => (
                  <Card key={product.id}>
                    <img 
                      src={product.thumbnail_url || product.image_url}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        borderRadius: '8px'
                      }}
                    />
                  </Card>
                ))}
              </CardSwap>
            </div>
          }
        />
        </div>
      </ParallaxSection>

      {/* Services */}
      <ParallaxSection gradient="linear-gradient(135deg, #000000 0%, #000000 100%)" index={2}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <Galaxy 
            mouseRepulsion={true}
            mouseInteraction={true}
            density={1.5}
            glowIntensity={0.5}
            saturation={0.8}
            hueShift={140}
            transparent={true}
          />
        </div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
        <SectionCard
          tag="Our Services"
          title="AR Solutions for Everyone"
          description="From custom AR campaigns to creator tools, we provide innovative solutions that blend reality with imagination."
          visual={
            (() => {
              const LottiePlayer = 'lottie-player' as any;
              
              const services = [
                { 
                  title: 'AR Interior Designer', 
                  animation: arFurnitureAnimation,
                  comingSoon: false
                },
                { 
                  title: 'Creator Tools', 
                  animation: studioAnimation,
                  comingSoon: true
                },
                { 
                  title: 'Mobile App', 
                  animation: phoneAnimation,
                  comingSoon: true
                },
                { 
                  title: 'Mixed Reality', 
                  animation: xrAnimation,
                  comingSoon: false
                },
              ];

              const serviceCards = services.map((service, i) => (
                <div key={i} style={{
                  position: 'relative',
                  width: '120px',
                  height: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center'
                }}>
                  {service.comingSoon && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: '#fff',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '50px',
                      fontSize: '0.6rem',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      boxShadow: '0 4px 15px rgba(240, 147, 251, 0.6)',
                      zIndex: 10
                    }}>
                      Soon
                    </div>
                  )}
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    overflow: 'visible',
                    padding: '1.2rem',
                    marginBottom: '0.5rem'
                  }}>
                    <LottiePlayer
                      src={JSON.stringify(service.animation)}
                      background="transparent"
                      speed="1"
                      loop
                      autoplay
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <h3 style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#fff',
                    lineHeight: '1.2',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    margin: 0
                  }}>
                    {service.title}
                  </h3>
                </div>
              ));

              return (
                <div className="orbiting-services-wrapper" style={{ padding: '2rem', position: 'relative' }}>
                  {/* Visible Orbit Path */}
                  <div className="orbit-path" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    border: '2px dashed rgba(255,255,255,0.25)',
                    boxShadow: '0 0 20px rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.05)',
                    pointerEvents: 'none',
                    zIndex: 0
                  }} />
                  
                  <OrbitingCircles iconSize={120} radius={180} speed={1.5}>
                    {serviceCards[0]}
                    {serviceCards[1]}
                    {serviceCards[2]}
                    {serviceCards[3]}
                  </OrbitingCircles>
                </div>
              );
            })()
          }
        />
        </div>
      </ParallaxSection>

      {/* Join Our Growing Community */}
      <ParallaxSection gradient="linear-gradient(135deg, #000000 0%, #000000 100%)" index={3}>
        <div className="join-us-orb-container" style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={260}
            forceHoverState={false}
          />
        </div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
        <SectionCard
          tag="Join Us"
          title="Growing Together"
          description="Be part of our thriving community. Experience the future of augmented reality with POST-kAR."
          reverse={true}
          visual={
            <GlassIcons 
              className="community-glass-icons"
              items={[
                { 
                  icon: (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ fontSize: '2.5rem' }}>👁️</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                        {visitsCount}
                      </div>
                    </div>
                  ), 
                  color: 'purple', 
                  label: 'Visits'
                },
                { 
                  icon: (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ fontSize: '2.5rem' }}>👥</span>
                      <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                        {activeUsersCount}
                      </div>
                    </div>
                  ), 
                  color: 'red', 
                  label: 'Active Users'
                },
                { 
                  icon: (() => {
                    const LottiePlayer = 'lottie-player' as any;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                        <LottiePlayer
                          src={indianFlagAnim}
                          background="transparent"
                          speed="1"
                          loop
                          autoplay
                          style={{ width: 60, height: 60 }}
                        />
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          Connected
                        </div>
                      </div>
                    );
                  })(), 
                  color: 'green', 
                  label: 'Connected'
                },
              ]}
            />
          }
        />
        </div>
      </ParallaxSection>
      </div>
      {/* End Stacked Parallax Sections */}

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
            <div className="footer-bottom-content">
              <div className="footer-made-with">
                <span>Made with</span>
                <img src={lovePng} alt="love" style={{ width: '16px', height: '16px', display: 'inline-block', verticalAlign: 'middle' }} />
                <span>from</span>
                {(() => {
                  const LottiePlayer = 'lottie-player' as any;
                  return (
                    <LottiePlayer
                      src={indianFlagAnim}
                      background="transparent"
                      speed="1"
                      style={{ width: '24px', height: '24px', display: 'inline-block', verticalAlign: 'middle' }}
                      loop
                      autoplay
                    />
                  );
                })()}
              </div>
              <div className="footer-copyright">
                &copy; 2025 NitiNex Studio. All rights reserved.
              </div>
            </div>
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

      {/* === MASCOT === */}
      <Mascot model="home" />

      {/* Fullscreen Video Modal */}
      {fullscreenVideo && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setFullscreenVideo(null)}
        >
          <div style={{ position: 'relative', width: '100%', maxWidth: '800px', aspectRatio: '9/16' }} onClick={(e) => e.stopPropagation()}>
            <video
              ref={fullscreenVideoRef}
              src={fullscreenVideo.src}
              autoPlay
              loop
              playsInline
              muted={muted[fullscreenVideo.index]}
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
            />
            {/* Close button */}
            <button
              onClick={() => setFullscreenVideo(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            {/* Mute button - bottom right */}
            <button
              onClick={() => toggleMute(fullscreenVideo.index)}
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {muted[fullscreenVideo.index] ? '🔇' : '🔊'}
            </button>
            {/* Play/Pause button - above mute button */}
            <button
              onClick={() => {
                if (fullscreenVideoRef.current) {
                  if (isPlaying) {
                    fullscreenVideoRef.current.pause();
                  } else {
                    fullscreenVideoRef.current.play();
                  }
                  setIsPlaying(!isPlaying);
                }
              }}
              style={{
                position: 'absolute',
                bottom: '4rem',
                right: '1rem',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                width: '50px',
                height: '50px',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}