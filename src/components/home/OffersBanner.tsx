import { useEffect, useRef } from 'react';
import './OffersBanner.css';

interface Offer {
    id: number;
    text: string;
    active: boolean;
}

interface OffersBannerProps {
    offers?: Offer[];
}

// Predefined gradients and colors for offers (handled in frontend)
const offerDesigns = [
    { gradient: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#1a1a1a' }, // Gold
    { gradient: 'linear-gradient(135deg, #E5E4E2, #B4B4B8)', color: '#1a1a1a' }, // Silver
    { gradient: 'linear-gradient(135deg, #C0C0C0, #808080)', color: '#1a1a1a' }, // Grey
    { gradient: 'linear-gradient(135deg, #50C878, #2E8B57)', color: '#ffffff' }, // Green
    { gradient: 'linear-gradient(135deg, #E0115F, #9B111E)', color: '#ffffff' }, // Red
    { gradient: 'linear-gradient(135deg, #0F52BA, #082567)', color: '#ffffff' }, // Blue
    { gradient: 'linear-gradient(135deg, #9B59B6, #8E44AD)', color: '#ffffff' }, // Purple
    { gradient: 'linear-gradient(135deg, #F39C12, #E67E22)', color: '#1a1a1a' }, // Orange
];

export default function OffersBanner({ offers = [] }: OffersBannerProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Default offers as fallback
    const defaultOffers: Offer[] = [
        { id: 1, text: 'FREE DELIVERY FOR PREPAID ORDERS!', active: true },
        { id: 2, text: 'BUY 5 GET 3 FREE!', active: true },
        { id: 3, text: 'BUY 2 GET 1 FREE!', active: true },
        { id: 4, text: 'BUY 4 GET 2 FREE!', active: true },
        { id: 5, text: 'BUY 6 GET 4 FREE!', active: true },
        { id: 6, text: 'BUY 7 GET 5 FREE!', active: true },
    ];

    const displayOffers = offers.length > 0 ? offers : defaultOffers;

    // Auto-scroll functionality
    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let scrollPosition = 0;
        const scrollSpeed = 0.5; // pixels per frame

        const scroll = () => {
            scrollPosition += scrollSpeed;

            // Reset when we've scrolled through half the content (because it's duplicated)
            if (scrollPosition >= scrollContainer.scrollWidth / 2) {
                scrollPosition = 0;
            }

            scrollContainer.scrollLeft = scrollPosition;
            requestAnimationFrame(scroll);
        };

        const animationId = requestAnimationFrame(scroll);

        // Pause on hover
        const handleMouseEnter = () => {
            cancelAnimationFrame(animationId);
        };

        const handleMouseLeave = () => {
            requestAnimationFrame(scroll);
        };

        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationId);
            scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
            scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Duplicate offers for seamless infinite scroll
    const duplicatedOffers = [...displayOffers, ...displayOffers, ...displayOffers];

    return (
        <div className="offers-banner-wrapper">
            <div className="offers-banner-container" ref={scrollRef}>
                <div className="offers-banner-track">
                    {duplicatedOffers.map((offer, index) => {
                        // Cycle through predefined designs
                        const design = offerDesigns[index % offerDesigns.length];

                        return (
                            <div
                                key={`${offer.id}-${index}`}
                                className="offer-banner-item"
                                style={{
                                    background: design.gradient,
                                    color: design.color
                                }}
                            >
                                <div className="offer-banner-content">
                                    <div className="offer-badge-icon">
                                        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                        </svg>
                                    </div>
                                    <div className="offer-banner-text">
                                        <span className="offer-main">{offer.text}</span>
                                    </div>
                                    <div className="offer-arrow">→</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
