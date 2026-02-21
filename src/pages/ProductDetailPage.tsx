import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import ProductGrid from '../components/product/ProductGrid';
import { ProductService } from '../services/ProductService';
import { useNavigation } from '../hooks/useNavigation';
import { useBreadcrumbs } from '../hooks/useBreadcrumbs';
import { findVariant } from '../types/marker';
import type { Product } from '../types';
import type { Variant } from '../types/marker';
import './ProductDetailPage.css';

// Use real API service
const productService = ProductService.getInstance();

const WHATSAPP_NUMBER = '917579122216';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.postkar';

function getWhatsAppProductUrl(productName: string): string {
  const msg = encodeURIComponent(`Hi, I want to buy this Post-kAR product: ${productName}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { navigate } = useNavigation();
  const { updateBreadcrumbsForPage } = useBreadcrumbs();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Variant selection state
  const [selectedProductType, setSelectedProductType] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(true);

  // Get selected variant based on current selection
  const selectedVariant: Variant | null = useMemo(() => {
    if (!product || !selectedProductType || !selectedSize) return null;
    return findVariant(product as any, selectedProductType, selectedSize);
  }, [product, selectedProductType, selectedSize]);

  // Build media slides: images + optional video (aim for 4 slides)
  type Slide = { type: 'image' | 'video'; src: string };
  const slides: Slide[] = useMemo<Slide[]>(() => {
    const list: Slide[] = [];
    if (product?.image_url) list.push({ type: 'image', src: product.image_url });
    if (product?.thumbnail_url && product.thumbnail_url !== product.image_url) {
      list.push({ type: 'image', src: product.thumbnail_url });
    }
    if (product?.video_url) list.push({ type: 'video', src: product.video_url });
    if (list.length > 0) {
      while (list.length < 4) list.push(list[0]);
    }
    return list;
  }, [product]);

  const goPrev = () => {
    setCurrentSlide((prev) => (slides.length ? (prev - 1 + slides.length) % slides.length : 0));
  };

  const goNext = () => {
    setCurrentSlide((prev) => (slides.length ? (prev + 1) % slides.length : 0));
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Product ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const productData = await productService.getProduct(id);

        if (!productData) {
          setError('Product not found');
        } else {
          setProduct(productData);

          // Auto-select first product type and size if variants exist
          if (productData.productTypes && productData.productTypes.length > 0) {
            const firstType = productData.productTypes[0];
            setSelectedProductType(firstType.type);

            if (firstType.variants && firstType.variants.length > 0) {
              setSelectedSize(firstType.variants[0].size);
            }
          }

          // Update breadcrumbs with product name
          updateBreadcrumbsForPage(window.location.pathname, productData.name);
          // Load related products
          try {
            setRelatedLoading(true);
            const all = await productService.getProducts();
            const cat = (productData as any)?.metadata?.category;
            const filtered = (all || []).filter(p => p.id !== productData!.id && (!cat || (p as any)?.metadata?.category === cat));
            setRelatedProducts(filtered.length > 0 ? filtered : (all || []).filter(p => p.id !== productData!.id));
          } catch (e) {
            setRelatedProducts([]);
          } finally {
            setRelatedLoading(false);
          }
        }
      } catch (err) {
        setError('Failed to load product. Please try again later.');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    // Intentionally depend only on `id` to avoid flicker loops when breadcrumbs update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);



  if (loading) {
    return (
      <div className="product-detail-page">
        <Navigation />
        <div className="product-detail-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <Navigation />
        <div className="product-detail-container">
          <div className="error-state">
            <h2>Product Not Found</h2>
            <p>{error || 'The product you\'re looking for doesn\'t exist or has been removed.'}</p>
            <div className="error-actions">
              <Link to="/products" className="btn btn-primary">
                Browse Products
              </Link>
              <button onClick={() => navigate('/products')} className="btn btn-secondary">
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Navigation />
      <div className="product-detail-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumb">
          <Link to="/products" className="breadcrumb-link">Products</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{product.name}</span>
        </nav>

        <div className="product-detail-content">
          <div className="product-image-section">
            <div className="product-image-container">
              {(!slides || slides.length === 0) && (
                <div className="image-loading"><div className="image-skeleton"></div></div>
              )}
              {slides && slides.length > 0 && (
                <div className="carousel">
                  <button className="carousel__control carousel__control--prev" onClick={goPrev} aria-label="Previous slide">‹</button>
                  <div className="carousel__viewport">
                    {slides.map((s: Slide, idx: number) => (
                      <div key={idx} className={`carousel__slide ${idx === currentSlide ? 'is-active' : ''}`} aria-hidden={idx !== currentSlide}>
                        {s.type === 'image' ? (
                          <img
                            src={s.src}
                            alt={product?.name || 'Product'}
                            className="product-image"
                          />
                        ) : (
                          <video
                            className="product-video"
                            controls
                            playsInline
                            preload="metadata"
                          >
                            <source src={s.src} type="video/mp4" />
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="carousel__control carousel__control--next" onClick={goNext} aria-label="Next slide">›</button>
                  <div className="carousel__dots">
                    {slides.map((_: Slide, i: number) => (
                      <button key={i} className={`carousel__dot ${i === currentSlide ? 'is-active' : ''}`} onClick={() => setCurrentSlide(i)} aria-label={`Go to slide ${i + 1}`}></button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-description">{product.description}</p>

              {/* Category removed per request */}

              {/* Product Type Selector */}
              {product.productTypes && product.productTypes.length > 0 && (
                <div className="option-group">
                  <h3 className="option-title">Choose Product Type</h3>
                  <div className="option-row">
                    {product.productTypes.map((type) => (
                      <button
                        key={type.type}
                        type="button"
                        className={`option-chip ${selectedProductType === type.type ? 'is-active' : ''}`}
                        onClick={() => {
                          setSelectedProductType(type.type);
                          // Reset size to first available
                          if (type.variants && type.variants.length > 0) {
                            setSelectedSize(type.variants[0].size);
                          }
                        }}
                      >
                        <div className="type-name">{type.type}</div>
                        <div className="type-badge">{type.positioning}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {selectedProductType && product.productTypes && (
                <div className="option-group">
                  <h3 className="option-title">Choose Size</h3>
                  <div className="option-row">
                    {product.productTypes
                      .find(t => t.type === selectedProductType)
                      ?.variants.map((variant) => (
                        <button
                          key={variant.size}
                          type="button"
                          className={`option-chip size-option ${selectedSize === variant.size ? 'is-active' : ''} ${!variant.inStock ? 'is-disabled' : ''}`}
                          onClick={() => variant.inStock && setSelectedSize(variant.size)}
                          disabled={!variant.inStock}
                        >
                          <div className="size-label">{variant.size}</div>
                          <div className="size-price">₹{variant.discountedPrice}</div>
                          {!variant.inStock && <div className="out-of-stock">Out of Stock</div>}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Price — always visible */}
              <div className="product-price-section">
                <div className="pricing-display">
                  <span className="product-price">₹599</span>
                  <span className="product-price-original">₹799</span>
                  <span className="product-discount-badge">25% OFF</span>
                </div>
              </div>


              <div className="product-actions">
                <a
                  href={getWhatsAppProductUrl(product.name)}
                  className="whatsapp-cta-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="pdp-whatsapp-btn"
                  aria-label={`Buy ${product.name} on WhatsApp`}
                >
                  💬 Buy on WhatsApp
                </a>
                <a
                  href={PLAY_STORE_URL}
                  className="playstore-cta-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="pdp-playstore-btn"
                  aria-label="Get the Post-kAR App from Play Store"
                >
                  ▶ Get the App
                </a>
                {/* Add to Cart button hidden */}
              </div>

              {/* Reviews section hidden */}

            </div>
          </div>
        </div>

        {/* Similar Products (same grid style as Products page) */}
        <section className="similar-section">
          <h2 className="similar-title">You might also like</h2>
          <ProductGrid
            products={relatedProducts}
            loading={relatedLoading}
            onProductClick={(pid: string) => navigate(`/product/${pid}`)}
          />
        </section>
      </div>
    </div>
  );
}