import { useState, useRef, useEffect } from 'react';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  style?: React.CSSProperties;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  autoPlay?: boolean;
  priority?: boolean; // High priority videos load immediately
  onVideoRef?: (ref: HTMLVideoElement | null) => void;
  children?: React.ReactNode;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  poster,
  className,
  style,
  muted = true,
  loop = true,
  playsInline = true,
  autoPlay = false,
  priority = false,
  onVideoRef,
  children
}) => {
  const [isInView, setIsInView] = useState(priority); // Priority videos load immediately
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Priority videos skip intersection observer
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.01
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isInView, priority]);

  useEffect(() => {
    if (videoRef.current && onVideoRef) {
      onVideoRef(videoRef.current);
    }
  }, [onVideoRef]);

  const handleLoadedData = () => {
    setIsLoaded(true);
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Ignore autoplay failures
      });
    }
  };

  return (
    <div ref={containerRef} className={className} style={style}>
      {isInView ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          onLoadedData={handleLoadedData}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          preload={priority ? 'auto' : 'metadata'} // Priority videos preload fully
        />
      ) : (
        // Show placeholder while not in view
        poster && (
          <img
            src={poster}
            alt="Video thumbnail"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        )
      )}
      {children}
    </div>
  );
};
