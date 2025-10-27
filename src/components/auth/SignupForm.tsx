import React, { useState } from 'react';
import { Loader2, Phone, KeyRound, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/AuthService';

interface SignupFormProps {
  onSuccess: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
  });
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

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form data
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);

    try {
      // Use mock service for development
      const response = await authService.sendOTPMock({
        mobileNumber: formData.mobileNumber,
        type: 'signup'
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
        mobileNumber: formData.mobileNumber,
        otp,
        otpId,
        type: 'signup',
        name: formData.name
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
        mobileNumber: formData.mobileNumber,
        type: 'signup'
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

  if (step === 'details') {
    return (
      <form onSubmit={handleSendOTP} className="auth-form">
        <div className="auth-form-group">
          <label htmlFor="name" className="auth-form-label">
            <User size={16} />
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            className="auth-form-input"
            required
          />
        </div>

        <div className="auth-form-group">
          <label htmlFor="mobile" className="auth-form-label">
            <Phone size={16} />
            Mobile Number
          </label>
          <input
            id="mobile"
            type="tel"
            value={formData.mobileNumber}
            onChange={(e) => handleInputChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Enter your mobile number"
            className="auth-form-input"
            maxLength={10}
            required
          />
        </div>

        {error && <div className="auth-form-error">{error}</div>}

        <button
          type="submit"
          disabled={isLoading || !formData.name.trim() || formData.mobileNumber.length !== 10}
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
          OTP sent to +91 {formData.mobileNumber}
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
            Creating Account...
          </>
        ) : (
          'Verify & Create Account'
        )}
      </button>

      <div className="auth-form-actions">
        <button
          type="button"
          onClick={() => setStep('details')}
          className="auth-form-link"
        >
          Change details
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

export default SignupForm;
