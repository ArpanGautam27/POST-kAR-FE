import { useEffect, useRef, useState } from 'react';
import Navigation from '../components/layout/Navigation';
import Mascot from '../components/common/Mascot';
import ProductGrid from '../components/product/ProductGrid';
import type { Product } from '../types';
import ikaasFrame from '../assets/ikaas_frame.jpg';
import './FreeExperiencePage.css';

export default function FreeExperiencePage() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [boxStyle, setBoxStyle] = useState<{width:number;height:number;left:number;top:number}>({width:0,height:0,left:0,top:0});
  
  // Compute contained box so image and video share identical rendered size
  const computeContainedBox = () => {
    const cont = containerRef.current;
    const img = imgRef.current as HTMLImageElement | null;
    if (!cont || !img) return;
    const cw = cont.clientWidth;
    const ch = cont.clientHeight;
    const iw = img.naturalWidth || cw;
    const ih = img.naturalHeight || ch;
    if (!iw || !ih || !cw || !ch) return;
    const scale = Math.min(cw / iw, ch / ih);
    const w = Math.round(iw * scale);
    const h = Math.round(ih * scale);
    const left = Math.floor((cw - w) / 2);
    const top = Math.floor((ch - h) / 2);
    setBoxStyle({ width: w, height: h, left, top });
  };

  useEffect(() => {
    if (!open) return;
    computeContainedBox();
    const onResize = () => computeContainedBox();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKeyDown);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);
  const freeExperienceProduct: Product = {
    id: 'free-exp',
    name: 'Free Experience',
    description: 'Try a sample AR experience for free',
    thumbnail_url: ikaasFrame,
    image_url: ikaasFrame,
    image_id: 'free_exp_placeholder',
    video_url: ''
  };

  return (
    <div className="products-page" style={{ background: 'transparent' }}>
      <Navigation />
      <div className="products-container" style={{ paddingTop: 80 }}>
        <div className="products-header" style={{ marginBottom: 64, marginTop: 40 }}>
          <h1 className="products-title" style={{ color: '#ffffff' }}>Free Experience</h1>
        </div>
        <div style={{ position: 'relative' }}>
          <ProductGrid
            products={[freeExperienceProduct]}
            loading={false}
            onProductClick={() => setOpen(true)}
            cardProps={{ hideCart: true }}
          />
        </div>
        {open && (
          <div 
            className="free-experience-modal"
            onClick={(e) => {
              // Close modal when clicking on backdrop
              if (e.target === e.currentTarget) {
                setOpen(false);
              }
            }}
          >
            <button 
              className="free-experience-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Close modal"
              type="button"
            >
              ×
            </button>
            {/* Fixed dimensions: 1029x1280 */}
            <div
              style={{
                width: '1029px',
                height: '1280px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                position: 'relative',
              }}
            >
              <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />
              <img
                ref={imgRef}
                src={freeExperienceProduct.image_url}
                alt={freeExperienceProduct.name}
                style={{ position: 'absolute', width: boxStyle.width, height: boxStyle.height, left: boxStyle.left, top: boxStyle.top, objectFit: 'fill', display: 'block' }}
                onLoad={() => {
                  // compute sizes when image is ready
                  const compute = () => {
                    const cont = containerRef.current;
                    const img = imgRef.current as HTMLImageElement | null;
                    if (!cont || !img) return;
                    const cw = cont.clientWidth;
                    const ch = cont.clientHeight;
                    const iw = img.naturalWidth || cw;
                    const ih = img.naturalHeight || ch;
                    const scale = Math.min(cw / iw, ch / ih);
                    const w = Math.round(iw * scale);
                    const h = Math.round(ih * scale);
                    const left = Math.floor((cw - w) / 2);
                    const top = Math.floor((ch - h) / 2);
                    setBoxStyle({ width: w, height: h, left, top });
                  };
                  compute();
                  setTimeout(compute, 0);
                }}
              />
              {freeExperienceProduct.video_url && (
                <video
                  ref={videoRef}
                  src={freeExperienceProduct.video_url}
                  style={{ position: 'absolute', width: boxStyle.width, height: boxStyle.height, left: boxStyle.left, top: boxStyle.top, objectFit: 'fill', display: 'block', zIndex: 1, pointerEvents: 'none' }}
                  muted
                  autoPlay
                  loop
                  playsInline
                  controls={false}
                />
              )}
              {/* Recompute on resize/open */}
              {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
              {(() => { /* inline effect container - will be ignored in runtime */ return null; })()}
            </div>
          </div>
        )}
      </div>
      <Mascot />
    </div>
  );
}
