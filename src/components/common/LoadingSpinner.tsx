import './LoadingSpinner.css';
import happyDog from '../../assets/happy_dog_loader.json?url';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export default function LoadingSpinner({ size = 'medium', message }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      {(() => {
        const LottiePlayer = 'lottie-player' as any;
        return (
          <LottiePlayer
            src={happyDog}
            background="transparent"
            speed="1"
            loop
            autoplay
            style={{ width: 160, height: 160 }}
          />
        );
      })()}
      {message && <p className="loading-spinner__message">{message}</p>}
    </div>
  );
}