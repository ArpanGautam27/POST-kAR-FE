import React, { useState } from 'react';
import { Loader2, Phone, KeyRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/AuthService';

interface AuthFormProps {
  onSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
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

    // Validate mobile number
    if (!mobileNumber || mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    try {
      // Use mock service for development - will automatically handle login/signup
      const response = await authService.sendOTPMock({
        mobileNumber,
        type: 'login' // We use 'login' as default since the flow is the same
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
      // Use mock service for development
      const response = await authService.verifyOTPMock({
        mobileNumber,
        otp,
        otpId,
        type: 'login' // The backend will handle whether it's login or signup
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
      const response = await authService.sendOTPMock({
        mobileNumber,
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

  if (step === 'mobile') {
    return (
      <form onSubmit={handleSendOTP} className="auth-form">
        <div className="auth-form-group">
          <label htmlFor="mobile" className="auth-form-label">
            <Phone size={16} />
            Mobile Number
          </label>
          <input
            id="mobile"
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Enter your mobile number"
            className="auth-form-input"
            maxLength={10}
            required
          />
        </div>

        {error && <div className="auth-form-error">{error}</div>}

        <button
          type="submit"
          disabled={isLoading || mobileNumber.length !== 10}
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
          <p>We'll send you a 6-digit OTP to verify your mobile number.</p>
          <p>If you're a new user, an account will be created automatically.</p>
          <p className="auth-demo-info">
            <strong>Demo:</strong> Use OTP <code>123456</code> for testing
          </p>
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
          OTP sent to +91 {mobileNumber}
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
          'Verify & Continue'
        )}
      </button>

      <div className="auth-form-actions">
        <button
          type="button"
          onClick={() => setStep('mobile')}
          className="auth-form-link"
        >
          Change mobile number
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

export default AuthForm;
