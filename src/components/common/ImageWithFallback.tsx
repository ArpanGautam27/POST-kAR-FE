import { useState, useRef, useEffect } from 'react';
import './ImageWithFallback.css';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  lazy?: boolean;
  sizes?: string;
  srcSet?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/placeholder-image.jpg',
  className = '',
  lazy = true,
  sizes,
  srcSet,
  onLoad,
  onError
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(lazy ? '' : src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isInView, setIsInView] = useState(!lazy);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setCurrentSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px' // Start loading 50px before the image comes into view
      }
    );

    observer.observe(imgRef.current);

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [src, lazy]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
      onError?.();
    } else {
      setIsLoading(false);
    }
  };

  const shouldShowPlaceholder = isLoading || (!isInView && lazy);

  return (
    <div className={`image-with-fallback ${className}`} ref={imgRef}>
      {shouldShowPlaceholder && (
        <div className="image-with-fallback__placeholder">
          <div className="image-with-fallback__skeleton"></div>
        </div>
      )}
      
      {(isInView || !lazy) && (
        <img
          src={currentSrc}
          alt={alt}
          className={`image-with-fallback__img ${isLoading ? 'image-with-fallback__img--loading' : ''}`}
          sizes={sizes}
          srcSet={srcSet}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
        />
      )}
    </div>
  );
}