import type { User } from '../contexts/AuthContext';

export interface SendOTPRequest {
  email: string;
  type: 'login' | 'signup';
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  otpId?: string;
}

export interface VerifyOTPRequest {
  email: string;
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
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    // Ensure /api prefix is included
    this.baseURL = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;
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

    console.log(`[AuthService] Making request to: ${url}`);
    console.log(`[AuthService] Request config:`, { method: config.method, headers: config.headers });
    if (options.body) {
      console.log(`[AuthService] Request body:`, options.body);
    }

    try {
      const response = await fetch(url, config);
      
      console.log(`[AuthService] Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`[AuthService] API Error:`, errorData);
        const errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`[AuthService] Response data:`, data);
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('[AuthService] Network error - Failed to fetch. Possible causes:');
        console.error('  1. CORS issue');
        console.error('  2. Backend server is down');
        console.error('  3. Invalid URL:', url);
        console.error('  4. Network connectivity issue');
        throw new Error('Network error: Unable to connect to server. Please check your connection or try again later.');
      }
      console.error('[AuthService] Request failed:', error);
      throw error;
    }
  }

  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    // Direct API call - no mock fallback
    return await this.makeRequest<SendOTPResponse>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    // Direct API call - no mock fallback
    return await this.makeRequest<VerifyOTPResponse>('/auth/verify-otp', {
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
    if (!request.email || !request.email.includes('@')) {
      return {
        success: false,
        message: 'Please enter a valid email address',
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
      email: request.email,
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
