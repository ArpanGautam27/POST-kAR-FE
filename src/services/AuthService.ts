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
    // Use environment variable or default to dev backend
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://dev.post-kar.com';
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Debug logging to verify API calls
    console.log('🔵 API Request:', {
      url,
      method: options.method || 'GET',
      baseURL: this.baseURL,
      endpoint
    });

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

      console.log('✅ API Response:', {
        url,
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 API Data:', data);
      return data;
    } catch (error) {
      console.error('❌ API request failed:', error);
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
}

export const authService = new AuthService();
export { AuthService };
