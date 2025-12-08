import React, { useState } from 'react';
import { Loader2, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/AuthService';

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
  const [otpId, setOtpId] = useState<string | null>(null);

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

    console.log('=== [AuthForm] SEND OTP STARTED ===');
    console.log('[AuthForm] Email entered:', email);

    if (!email || !email.includes('@')) {
      console.warn('[AuthForm] Invalid email format');
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    console.log('[AuthForm] Calling authService.sendOTP...');

    try {
      // AuthService handles mock/real API logic internally
      const response = await authService.sendOTP({ email, type: 'login' });
      
      console.log('[AuthForm] sendOTP response:', response);
      
      if (response.success) {
        console.log('[AuthForm] ✅ OTP sent successfully!');
        console.log('[AuthForm] OTP ID:', response.otpId);
        setOtpId(response.otpId || null);
        setStep('otp');
        startResendTimer();
        console.log('[AuthForm] Moved to OTP verification step');
      } else {
        console.error('[AuthForm] ❌ OTP sending failed:', response.message);
        setError(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('[AuthForm] ❌ Exception while sending OTP:', error);
      console.error('[AuthForm] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      if (error instanceof Error) {
        console.error('[AuthForm] Error message:', error.message);
        console.error('[AuthForm] Error stack:', error.stack);
      }
      setError(error instanceof Error ? error.message : 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('=== [AuthForm] SEND OTP COMPLETED ===\n');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('=== [AuthForm] VERIFY OTP STARTED ===');
    console.log('[AuthForm] Email:', email);
    console.log('[AuthForm] OTP entered:', otp);
    console.log('[AuthForm] OTP ID:', otpId);

    if (!otp || otp.length !== 4) {
      console.warn('[AuthForm] Invalid OTP length:', otp?.length);
      setError('Please enter the 4-digit OTP');
      return;
    }

    if (!otpId) {
      console.error('[AuthForm] Missing OTP ID - session invalid');
      setError('Invalid session. Please request OTP again.');
      return;
    }

    setIsLoading(true);
    console.log('[AuthForm] Calling authService.verifyOTP...');

    try {
      // AuthService handles mock/real API logic internally
      const response = await authService.verifyOTP({ email, otp, otpId, type: 'login' });
      
      console.log('[AuthForm] verifyOTP response:', response);
      
      if (response.success && response.token && response.user) {
        console.log('[AuthForm] ✅ OTP verified successfully!');
        console.log('[AuthForm] JWT Token received:', response.token?.substring(0, 20) + '...');
        console.log('[AuthForm] User data:', response.user);
        login(response.token, response.user);
        console.log('[AuthForm] User logged in, calling onSuccess()');
        onSuccess();
      } else {
        console.error('[AuthForm] ❌ OTP verification failed:', response.message);
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('[AuthForm] ❌ Exception while verifying OTP:', error);
      console.error('[AuthForm] Error type:', error instanceof Error ? error.constructor.name : typeof error);
      if (error instanceof Error) {
        console.error('[AuthForm] Error message:', error.message);
        console.error('[AuthForm] Error stack:', error.stack);
      }
      setError(error instanceof Error ? error.message : 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('=== [AuthForm] VERIFY OTP COMPLETED ===\n');
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) {
      console.log('[AuthForm] Resend blocked - timer still active:', resendTimer);
      return;
    }

    setError('');
    setIsLoading(true);

    console.log('=== [AuthForm] RESEND OTP STARTED ===');
    console.log('[AuthForm] Resending OTP to:', email);

    try {
      // AuthService handles mock/real API logic internally
      const response = await authService.sendOTP({ email, type: 'login' });
      
      console.log('[AuthForm] Resend OTP response:', response);
      
      if (response.success) {
        console.log('[AuthForm] ✅ OTP resent successfully!');
        console.log('[AuthForm] New OTP ID:', response.otpId);
        setOtpId(response.otpId || null);
        startResendTimer();
      } else {
        console.error('[AuthForm] ❌ Failed to resend OTP:', response.message);
        setError(response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('[AuthForm] ❌ Exception while resending OTP:', error);
      if (error instanceof Error) {
        console.error('[AuthForm] Error message:', error.message);
      }
      setError(error instanceof Error ? error.message : 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
      console.log('=== [AuthForm] RESEND OTP COMPLETED ===\n');
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
