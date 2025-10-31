import { useState } from 'react';
import Navigation from '../components/layout/Navigation';
import ProductGrid from '../components/product/ProductGrid';
import type { Product } from '../types';

export default function FreeExperiencePage() {
  const [open, setOpen] = useState(false);
  const freeExperienceProduct: Product = {
    id: 'free-exp',
    name: 'Free Experience',
    description: 'Try a sample AR experience for free',
    thumbnail_url: '/android-chrome-512x512.png',
    image_url: '/android-chrome-512x512.png',
    image_id: 'free_exp_placeholder',
    video_url: ''
  };

  return (
    <div className="products-page" style={{ background: 'transparent' }}>
      <Navigation />
      <div className="products-container" style={{ paddingTop: 80 }}>
        <div className="products-header" style={{ marginBottom: 64 }}>
          <h1 className="products-title" style={{ color: '#ffffff' }}>Free Experience</h1>
        </div>
        <ProductGrid
          products={[freeExperienceProduct]}
          loading={false}
          onProductClick={() => setOpen(true)}
          cardProps={{ hideCart: true }}
        />
        {open && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', width: 40, height: 40, borderRadius: 20, cursor: 'pointer' }}>×</button>
            <div style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 48px rgba(99,102,241,0.35)' }}>
              <img src={freeExperienceProduct.image_url} alt={freeExperienceProduct.name} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain', background: 'rgba(255,255,255,0.04)' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
