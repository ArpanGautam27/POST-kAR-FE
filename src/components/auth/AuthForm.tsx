import React, { useState } from 'react';
import { Loader2, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthFormProps {
  onSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
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

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // For now we mock email OTP locally; backend integration can be wired later
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      startResendTimer();
    }, 800);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 4) {
      setError('Please enter the 4-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      // Demo-only verification: accept OTP 1234
      if (otp !== '1234') {
        setError('Invalid OTP. Use 1234 for testing.');
      } else {
        const token = 'mock-email-token-' + Date.now();
        const user = {
          id: 'user-' + Date.now().toString(),
          email,
          createdAt: new Date().toISOString(),
        } as any;
        login(token, user);
        onSuccess();
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

    // Demo-only resend: just restart timer
    setTimeout(() => {
      setIsLoading(false);
      startResendTimer();
    }, 600);
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
            placeholder="Enter your email"
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
          <p>We'll send you a 4-digit OTP to verify your email address.</p>
          <p>If you're a new user, an account will be created automatically.</p>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerifyOTP} className="auth-form">
      <div className="auth-form-group">
        <label className="auth-form-label">
          <KeyRound size={16} />
          Enter OTP
        </label>
        <div className="auth-otp-grid">
          {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="auth-form-input otp-input-box"
              value={otp[index] || ''}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 1);
                const next = otp.split('');
                next[index] = val;
                const joined = next.join('').slice(0, 4);
                setOtp(joined);
                if (val && index < 3) {
                  const nextInput = (e.target.parentElement?.querySelectorAll('input')[index + 1] as HTMLInputElement | undefined);
                  nextInput?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !otp[index] && index > 0) {
                  const prevInput = (e.currentTarget.parentElement?.querySelectorAll('input')[index - 1] as HTMLInputElement | undefined);
                  prevInput?.focus();
                }
              }}
            />
          ))}
        </div>
        <p className="auth-form-helper">
          OTP sent to {email}
        </p>
      </div>

      {error && <div className="auth-form-error">{error}</div>}

      <button
        type="submit"
        disabled={isLoading || otp.length !== 4}
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
          onClick={() => setStep('email')}
          className="auth-form-link"
        >
          Change email
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
