import { Link } from 'react-router-dom';
import './CustomProductsSection.css';

interface CustomProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
}

export default function CustomProductsSection() {
    const customProducts: CustomProduct[] = [
        {
            id: 'custom-poster',
            title: 'Custom POSTER',
            description: 'Upload your image and create your personalized poster',
            image: '/placeholder-custom-poster.jpg',
            link: '/products?type=custom-poster'
        },
        {
            id: 'split-poster',
            title: 'Custom SPLIT POSTER',
            description: 'Split your image across multiple posters for dramatic effect',
            image: '/placeholder-split-poster.jpg',
            link: '/products?type=split-poster'
        },
        {
            id: 'retro-prints',
            title: 'Custom RETRO PRINTS',
            description: 'Transform your photos into vintage-style retro prints',
            image: '/placeholder-retro.jpg',
            link: '/products?type=retro-prints'
        },
        {
            id: 'pocket-photo',
            title: 'Custom MINI POCKET PHOTO',
            description: 'Carry your memories with mini pocket-sized photo prints',
            image: '/placeholder-pocket.jpg',
            link: '/products?type=pocket-photo'
        }
    ];

    return (
        <section className="custom-products-section">
            <div className="custom-container">
                <div className="custom-header">
                    <h2 className="custom-title">DESIGN YOUR OWN</h2>
                    <p className="custom-subtitle">
                        PRINTS
                    </p>
                </div>

                <div className="custom-grid">
                    {customProducts.map((product) => (
                        <Link
                            key={product.id}
                            to={product.link}
                            className="custom-card"
                        >
                            <div className="custom-image-wrapper">
                                <div className="custom-placeholder">
                                    <div className="upload-icon">📤</div>
                                    <p className="upload-text">UPLOAD YOUR<br />IMAGE HERE</p>
                                </div>
                                <div className="custom-overlay-gradient"></div>
                            </div>
                            <div className="custom-content">
                                <h3 className="custom-product-title">{product.title}</h3>
                                <p className="custom-description">{product.description}</p>
                                <span className="get-yours-btn">
                                    Get Yours
                                    <span className="arrow">→</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
