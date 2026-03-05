import { Link } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import './PrivacyPolicyPage.css';

export default function PrivacyPolicyPage() {
    return (
        <div className="privacy-page">
            <Navigation />
            <main className="privacy-container">
                <div className="privacy-header">
                    <h1 className="privacy-title">Privacy Policy</h1>
                    <p className="privacy-last-updated">Last updated: January 2026</p>
                </div>

                <div className="privacy-content">
                    <section className="privacy-section">
                        <h2>1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, including name, email address, and
                            phone number when you join our waitlist. We also collect usage data when you interact
                            with our AR experiences.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>2. How We Use Your Information</h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, to
                            communicate with you about updates and features, and to personalize your experience
                            with PostkAR.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>3. Information Sharing</h2>
                        <p>
                            We do not sell your personal information. We may share your information with service
                            providers who assist us in operating our platform, or when required by law.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>4. Data Security</h2>
                        <p>
                            We implement appropriate security measures to protect your personal information.
                            However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>5. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal information. You may
                            also opt-out of marketing communications at any time.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>6. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar tracking technologies to track activity on our service and
                            hold certain information to improve user experience.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>7. Children's Privacy</h2>
                        <p>
                            Our service is not intended for children under 13. We do not knowingly collect
                            personal information from children under 13.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>8. Changes to Privacy Policy</h2>
                        <p>
                            We may update our Privacy Policy from time to time. We will notify you of any changes
                            by posting the new Privacy Policy on this page.
                        </p>
                    </section>

                    <section className="privacy-section">
                        <h2>9. Contact Us</h2>
                        <p>
                            If you have questions about this Privacy Policy, please contact us at{' '}
                            <a href="mailto:postkar.info@gmail.com">postkar.info@gmail.com</a> or through our
                            official communication channels.
                        </p>
                    </section>
                </div>

                <div className="privacy-footer-nav">
                    <Link to="/" className="privacy-back-btn">
                        ← Back to Home
                    </Link>
                </div>
            </main>
        </div>
    );
}
