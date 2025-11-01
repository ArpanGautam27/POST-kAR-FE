import { useEffect, useRef, useState } from 'react';
import Navigation from '../components/layout/Navigation';
import ProductGrid from '../components/product/ProductGrid';
import type { Product } from '../types';
import ikaasFrame from '../assets/ikaas_frame.jpg';

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
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
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
          {/* Transparent overlay to prevent marker detection in card */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              zIndex: 1,
              pointerEvents: 'none'
            }}
          />
        </div>
        {open && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', width: 40, height: 40, borderRadius: 20, cursor: 'pointer' }}>×</button>
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
    </div>
  );
}
