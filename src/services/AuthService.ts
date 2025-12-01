import type { User } from '../contexts/AuthContext';

export interface SendOTPRequest {
  mobileNumber: string;
  type: 'login' | 'signup';
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  otpId?: string;
}

export interface VerifyOTPRequest {
  mobileNumber: string;
  otp: string;
  otpId: string;
  type: 'login' | 'signup';
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface RefreshTokenResponse {
  success: boolean;
  token?: string;
  message?: string;
}

class AuthService {
  private baseURL: string;

  constructor() {
    // Use environment variable or default to localhost
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('postkar-auth-token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    return this.makeRequest<SendOTPResponse>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    return this.makeRequest<VerifyOTPResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    return this.makeRequest<RefreshTokenResponse>('/auth/refresh-token', {
      method: 'POST',
    });
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<{ success: boolean; user?: User; message?: string }> {
    return this.makeRequest<{ success: boolean; user?: User; message?: string }>('/auth/profile', {
      method: 'GET',
    });
  }

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; user?: User; message?: string }> {
    return this.makeRequest<{ success: boolean; user?: User; message?: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Mock implementation for development/testing
  async sendOTPMock(request: SendOTPRequest): Promise<SendOTPResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (!request.mobileNumber || request.mobileNumber.length !== 10) {
      return {
        success: false,
        message: 'Please enter a valid 10-digit mobile number',
      };
    }

    return {
      success: true,
      message: 'OTP sent successfully',
      otpId: 'mock-otp-id-' + Date.now(),
    };
  }

  async verifyOTPMock(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock OTP verification (accept 1234 as valid OTP)
    if (request.otp !== '1234') {
      return {
        success: false,
        message: 'Invalid OTP. Please try again.',
      };
    }

    // Mock user data
    const user: User = {
      id: 'user-' + Date.now(),
      mobileNumber: request.mobileNumber,
      createdAt: new Date().toISOString(),
    };

    // Mock JWT token
    const token = 'mock-jwt-token-' + Date.now();

    return {
      success: true,
      message: request.type === 'signup' ? 'Account created successfully' : 'Login successful',
      token,
      user,
    };
  }
}

export const authService = new AuthService();
export { AuthService };
