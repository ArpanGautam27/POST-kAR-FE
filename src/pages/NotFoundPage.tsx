import Navigation from '../components/layout/Navigation';
import { useNavigation } from '../hooks/useNavigation';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const { navigate, goBack } = useNavigation();

  const handleBrowseProducts = () => {
    navigate('/products');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    goBack();
  };

  return (
    <div className="not-found-page">
      <Navigation />
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-description">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <div className="not-found-actions">
            <button onClick={handleBrowseProducts} className="btn btn-primary">
              Browse Products
            </button>
            <button onClick={handleGoHome} className="btn btn-secondary">
              Go Home
            </button>
            <button onClick={handleGoBack} className="btn btn-tertiary">
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}