import './ServicesSection.css';

interface Service {
    id: string;
    icon: string;
    title: string;
    description: string;
    link?: string;
}

const SERVICES: Service[] = [
    {
        id: 'creator-tools',
        icon: '🎨',
        title: 'Creator Tools',
        description: 'Design and publish your own AR-enabled posters, frames, and gifts with our easy-to-use creator platform.',
        link: '/products',
    },
    {
        id: 'mobile-app',
        icon: '📱',
        title: 'Mobile App',
        description: 'Scan any Post-kAR product with our app to instantly unlock immersive AR experiences — no headset needed.',
        link: 'https://play.google.com/store/apps/details?id=com.postkar.arapp',
    },
    {
        id: 'virtual-tours',
        icon: '🌐',
        title: 'Virtual Tours',
        description: 'Take customers on interactive virtual walkthroughs of spaces, products, and experiences from anywhere.',
    },
    {
        id: 'mixed-reality',
        icon: '✨',
        title: 'Mixed Reality',
        description: 'Blend digital content seamlessly into the real world — bringing brands, memories, and stories to life.',
    },
];

export default function ServicesSection() {
    return (
        <section className="services-section" id="services">
            <div className="services-container">
                <div className="services-header">
                    <h2 className="services-title">What We Offer</h2>
                    <p className="services-subtitle">
                        Powerful AR experiences for creators, brands, and everyday users
                    </p>
                </div>

                <div className="services-grid">
                    {SERVICES.map((service) => (
                        <div key={service.id} className="service-card">
                            <div className="service-icon-wrapper">
                                <span className="service-icon" role="img" aria-label={service.title}>
                                    {service.icon}
                                </span>
                            </div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                            {service.link && (
                                service.link.startsWith('http') ? (
                                    <a
                                        href={service.link}
                                        className="service-link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Learn More →
                                    </a>
                                ) : (
                                    <a href={service.link} className="service-link">
                                        Learn More →
                                    </a>
                                )
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
