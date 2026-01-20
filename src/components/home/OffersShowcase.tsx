import { useState } from 'react';
import './OffersShowcase.css';

interface Offer {
    id: number;
    buy: number;
    free: number;
    tier: 'gold' | 'platinum' | 'silver' | 'emerald' | 'ruby' | 'sapphire';
    badge: string;
    savings: string;
    daysLeft: number;
}

export default function OffersShowcase() {
    const [clickedOffer, setClickedOffer] = useState<number | null>(null);

    const offers: Offer[] = [
        {
            id: 1,
            buy: 3,
            free: 2,
            tier: 'gold',
            badge: 'Hot Deal',
            savings: 'Save up to 40%',
            daysLeft: 2
        },
        {
            id: 2,
            buy: 5,
            free: 3,
            tier: 'platinum',
            badge: 'Best Value',
            savings: 'Save up to 37.5%',
            daysLeft: 5
        },
        {
            id: 3,
            buy: 2,
            free: 1,
            tier: 'silver',
            badge: 'Popular',
            savings: 'Save up to 33%',
            daysLeft: 3
        },
        {
            id: 4,
            buy: 4,
            free: 2,
            tier: 'emerald',
            badge: 'New',
            savings: 'Save up to 33%',
            daysLeft: 4
        },
        {
            id: 5,
            buy: 6,
            free: 4,
            tier: 'ruby',
            badge: 'Exclusive',
            savings: 'Save up to 40%',
            daysLeft: 7
        },
        {
            id: 6,
            buy: 7,
            free: 5,
            tier: 'sapphire',
            badge: 'Flash Sale',
            savings: 'Save up to 42%',
            daysLeft: 1
        }
    ];

    const handleOfferClick = (offerId: number) => {
        setClickedOffer(offerId);
        console.log(`Claimed offer #${offerId}`);

        setTimeout(() => {
            setClickedOffer(null);
        }, 2000);
    };

    return (
        <div className="offers-showcase-container">
            <div className="offers-header">
                <span className="offers-badge">Limited Time</span>
                <h2 className="offers-title">Special Offers</h2>
                <p className="offers-subtitle">Grab these amazing deals before they're gone!</p>
            </div>

            <div className="offers-grid">
                {offers.map((offer) => (
                    <div
                        key={offer.id}
                        className={`offer-card offer-${offer.tier}`}
                        data-tier={offer.tier}
                    >
                        <div className="offer-badge-label">{offer.badge}</div>

                        <div className="offer-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                            </svg>
                        </div>

                        <div className="offer-content">
                            <div className="offer-main-text">
                                <div className="offer-buy">Buy {offer.buy} Get {offer.free}</div>
                                <div className="offer-free">FREE</div>
                            </div>
                            <p className="offer-description">
                                Purchase any {offer.buy} items and get {offer.free} additional items absolutely free!
                            </p>
                            <div className="offer-savings-tag">{offer.savings}</div>
                        </div>

                        <button
                            className={`offer-claim-button ${clickedOffer === offer.id ? 'claimed' : ''}`}
                            onClick={() => handleOfferClick(offer.id)}
                        >
                            {clickedOffer === offer.id ? '✓ Claimed!' : 'Claim Offer'}
                        </button>

                        <div className="offer-timer">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor" />
                            </svg>
                            <span>Ends in {offer.daysLeft} {offer.daysLeft === 1 ? 'day' : 'days'}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
