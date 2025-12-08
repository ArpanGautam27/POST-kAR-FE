import React, { useState } from 'react';
import { Loader2, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/AuthService';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpId, setOtpId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const { login } = useAuth();

  // Start countdown timer for resend OTP
  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Use real API service
      const response = await authService.sendOTP({
        email,
        type: 'login'
      });

      if (response.success) {
        setOtpId(response.otpId || '');
        setStep('otp');
        startResendTimer();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      // Use real API service
      const response = await authService.verifyOTP({
        email,
        otp,
        otpId,
        type: 'login'
      });

      if (response.success && response.token && response.user) {
        login(response.token, response.user);
        onSuccess();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await authService.sendOTP({
        email,
        type: 'login'
      });

      if (response.success) {
        setOtpId(response.otpId || '');
        startResendTimer();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <form onSubmit={handleSendOTP} className="auth-form">
        <div className="auth-form-group">
          <label htmlFor="email" className="auth-form-label">
            <Mail size={16} />
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="auth-form-input"
            required
          />
        </div>

        {error && <div className="auth-form-error">{error}</div>}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="auth-form-button"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Sending OTP...
            </>
          ) : (
            'Send OTP'
          )}
        </button>

        <div className="auth-form-info">
          <p>We'll send you a 6-digit OTP to verify your email address.</p>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOTP} className="auth-form">
      <div className="auth-form-group">
        <label htmlFor="otp" className="auth-form-label">
          <KeyRound size={16} />
          Enter OTP
        </label>
        <input
          id="otp"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit OTP"
          className="auth-form-input otp-input"
          maxLength={6}
          required
        />
        <p className="auth-form-helper">
          OTP sent to {email}
        </p>
      </div>

      {error && <div className="auth-form-error">{error}</div>}

      <button
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className="auth-form-button"
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify & Login'
        )}
      </button>

      <div className="auth-form-actions">
        <button
          type="button"
          onClick={() => setStep('email')}
          className="auth-form-link"
        >
          Change email address
        </button>

        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resendTimer > 0 || isLoading}
          className="auth-form-link"
        >
          {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
