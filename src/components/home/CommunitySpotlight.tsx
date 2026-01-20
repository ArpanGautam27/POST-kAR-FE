import { AnimatedTestimonials } from '../ui/AnimatedTestimonials';
import './CommunitySpotlight.css';

interface CommunitySpotlightProps {
    feedbackVideos: string[];
    muted: boolean[];
}

export default function CommunitySpotlight({ feedbackVideos, muted }: CommunitySpotlightProps) {
    return (
        <section className="community-spotlight-section">
            <div className="community-container">
                <div className="community-content-wrapper">
                    {/* Left side - Text content */}
                    <div className="community-text-content">
                        <h2 className="community-title">COMMUNITY SPOTLIGHT</h2>
                        <p className="community-subtitle">
                            SEE POST-kAR IN ACTION
                        </p>
                        <p className="community-description">
                            Watch how our community brings their spaces to life with augmented reality experiences.
                            Real stories, real transformations.
                        </p>
                    </div>

                    {/* Right side - Video carousel */}
                    <div className="community-testimonials-wrapper">
                        {feedbackVideos.length > 0 ? (
                            <AnimatedTestimonials
                                testimonials={feedbackVideos.map((src, idx) => ({
                                    src,
                                    isVideo: true,
                                    muted: muted[idx]
                                }))}
                                autoplay={true}
                            />
                        ) : (
                            <div className="community-placeholder">
                                <p>Loading community transformations...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
