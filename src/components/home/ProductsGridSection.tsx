import { Link } from 'react-router-dom';
import type { Product } from '../../types';
import './ProductsGridSection.css';

const WHATSAPP_NUMBER = '917579122216';

function getWhatsAppUrl(productName: string): string {
    const msg = encodeURIComponent(`Hi, I want to buy this Post-kAR product: ${productName}`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

interface ProductsGridSectionProps {
    products: Product[];
}

export default function ProductsGridSection({ products }: ProductsGridSectionProps) {
    const displayProducts = products.slice(0, 8);

    return (
        <section className="products-grid-section" id="products">
            <div className="products-container">
                <div className="products-header">
                    <h2 className="products-title">BEST SELLING</h2>
                    <p className="products-subtitle">
                        TOP FAVORITES - SEE POSTERS EVERYONE IS PICKING RIGHT NOW!
                    </p>
                </div>

                <div className="products-grid">
                    {displayProducts.map((product) => {
                        const sp = product.sellingPrice;
                        const mrp = product.mrp;
                        const disc = product.discountPercentage;

                        return (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="product-card"
                            >
                                <div className="product-image-wrapper">
                                    <img
                                        src={product.thumbnail_url || product.image_url}
                                        alt={product.name}
                                        className="product-image"
                                        loading="lazy"
                                    />
                                    {disc && disc > 0 && (
                                        <span className="sale-badge">Sale</span>
                                    )}
                                    <div className="product-overlay">
                                        <span className="quick-view">Quick View</span>
                                        <a
                                            href={getWhatsAppUrl(product.name)}
                                            className="whatsapp-buy-btn"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            aria-label={`Buy ${product.name} on WhatsApp`}
                                        >
                                            💬 Buy
                                        </a>
                                    </div>
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    {sp != null && (
                                        <div className="product-pricing">
                                            <span className="sale-price">₹{sp}</span>
                                            {mrp != null && mrp !== sp && (
                                                <span className="original-price">₹{mrp}</span>
                                            )}
                                            {disc != null && disc > 0 && (
                                                <span className="discount-badge">-{disc}%</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <div className="view-all-wrapper">
                    <Link to="/products" className="view-all-btn">
                        View All Products
                        <span className="arrow">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
