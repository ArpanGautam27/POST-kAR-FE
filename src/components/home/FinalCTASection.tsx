import './FinalCTASection.css';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.postkar.arapp';

export default function FinalCTASection() {
    const handleDownload = () => {
        window.open(PLAY_STORE_URL, '_blank', 'noopener,noreferrer');
    };

    const handleExplore = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const el = document.getElementById('products');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="final-cta-section" id="final-cta">
            <div className="final-cta-bg" aria-hidden="true" />
            <div className="final-cta-inner">
                <p className="final-cta-eyebrow">Ready to experience AR?</p>
                <h2 className="final-cta-headline">
                    Start Experiencing the Future Today
                </h2>
                <div className="final-cta-buttons">
                    <button
                        className="final-cta-btn-primary"
                        onClick={handleDownload}
                        id="final-download-btn"
                        aria-label="Download Post-kAR App"
                    >
                        <span>▶</span> Download App
                    </button>
                    <button
                        className="final-cta-btn-secondary"
                        onClick={handleExplore}
                        id="final-explore-btn"
                        aria-label="Explore Products"
                    >
                        Explore Products ↓
                    </button>
                </div>
            </div>
        </section>
    );
}
