import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import ProductGrid from '../components/product/ProductGrid';
import Modal from '../components/common/Modal';
import { ProductService } from '../services/ProductService';
import { useNavigation } from '../hooks/useNavigation';
import { useBreadcrumbs } from '../hooks/useBreadcrumbs';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';
import './ProductDetailPage.css';

// Use real API service
const productService = ProductService.getInstance();

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { navigate } = useNavigation();
  const { updateBreadcrumbsForPage } = useBreadcrumbs();
  const { addToCart, isInCart, getCartItem, updateQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedPresentation, setSelectedPresentation] = useState<'Framed Print' | 'Poster Board'>('Framed Print');
  const [selectedSize, setSelectedSize] = useState<'A4' | 'A3' | 'A2' | 'A1'>('A3');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState<boolean>(true);
  const [reviews, setReviews] = useState<Array<{ id: string; author: string; rating: number; comment: string; date: string }>>([
    { id: 'r1', author: 'Alex', rating: 5, comment: 'Looks amazing on my wall!', date: '2025-09-12' },
    { id: 'r2', author: 'Sam', rating: 4, comment: 'Great print quality. Fast delivery.', date: '2025-10-02' },
  ]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState<{ author: string; rating: number; comment: string }>({ author: '', rating: 5, comment: '' });

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

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => setIsReviewModalOpen(false);
  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const id = `r-${Date.now()}`;
    const date = new Date().toISOString().slice(0, 10);
    setReviews([{ id, author: newReview.author || 'Anonymous', rating: newReview.rating, comment: newReview.comment, date }, ...reviews]);
    setNewReview({ author: '', rating: 5, comment: '' });
    setIsReviewModalOpen(false);
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

  const handleScanClick = () => {
    // Use full page load to static scanner page under public/
    window.location.href = '/scanner/scan_mind.html';
  };


  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleQuantityChange = (change: number) => {
    if (product) {
      const cartItem = getCartItem(product.id);
      if (cartItem) {
        const newQuantity = cartItem.quantity + change;
        updateQuantity(product.id, newQuantity);
      }
    }
  };

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
                          <video className="product-video" controls playsInline preload="metadata">
                            <source src={s.src} />
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="carousel__control carousel__control--next" onClick={goNext} aria-label="Next slide">›</button>
                  <div className="carousel__dots">
                    {slides.map((_: Slide, i: number) => (
                      <button key={i} className={`carousel__dot ${i === currentSlide ? 'is-active' : ''}`} onClick={() => setCurrentSlide(i)} aria-label={`Go to slide ${i+1}`}></button>
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

              <div className="product-price-section">
                <span className="product-price">$99.99</span>
                {isInCart(product.id) && (
                  <div className="quantity-indicator">
                    <span>In Cart: {getCartItem(product.id)?.quantity || 0}</span>
                  </div>
                )}
              </div>

              {/* Presentation options */}
              <div className="option-group">
                <h3 className="option-title">Presentation</h3>
                <div className="option-row">
                  {['Framed Print', 'Poster Board'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`option-chip ${selectedPresentation === opt ? 'is-active' : ''}`}
                      onClick={() => setSelectedPresentation(opt as any)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size options */}
              <div className="option-group">
                <h3 className="option-title">Size</h3>
                <div className="option-row">
                  {(['A4','A3','A2','A1'] as const).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      className={`option-chip ${selectedSize === sz ? 'is-active' : ''}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div className="product-actions">
                {isInCart(product.id) ? (
                  <div className="cart-controls">
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-display">
                      {getCartItem(product.id)?.quantity || 0}
                    </span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleAddToCart}
                    className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                  >
                    {addedToCart ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                )}
                
                <button 
                  onClick={handleScanClick}
                  className="scan-btn"
                >
                  View on Scanner
                </button>
              </div>

              {/* Reviews Section */}
              <section className="reviews-section">
                <div className="reviews-header">
                  <h2 className="reviews-title">Reviews</h2>
                  <button className="btn btn-primary" onClick={openReviewModal}>Add Review</button>
                </div>
                {reviews.length === 0 ? (
                  <p className="reviews-empty">No reviews yet. Be the first to review.</p>
                ) : (
                  <ul className="reviews-list">
                    {reviews.map(r => (
                      <li key={r.id} className="review-item">
                        <div className="review-meta">
                          <span className="review-author">{r.author}</span>
                          <span className="review-date">{r.date}</span>
                          <span className="review-rating">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                        </div>
                        <p className="review-comment">{r.comment}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <Modal open={isReviewModalOpen} title="Add your review" onClose={closeReviewModal}>
                <form onSubmit={submitReview} className="pd-modal-form">
                  <label className="pd-field">
                    <span>Name</span>
                    <input type="text" value={newReview.author} onChange={(e) => setNewReview({ ...newReview, author: e.target.value })} placeholder="Your name" />
                  </label>
                  <label className="pd-field">
                    <span>Rating</span>
                    <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}>
                      {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </label>
                  <label className="pd-field">
                    <span>Comment</span>
                    <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} placeholder="Share details of your experience" rows={4} />
                  </label>
                  <div className="pd-modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={closeReviewModal}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit Review</button>
                  </div>
                </form>
              </Modal>

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