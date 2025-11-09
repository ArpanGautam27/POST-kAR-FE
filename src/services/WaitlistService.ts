/**
 * Waitlist Service
 * Handles API calls for waitlist functionality
 */

export interface WaitlistRequest {
  name?: string;
  mobileNumber: string;
  email?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    mobileNumber: string;
    joinedAt: string;
  };
}

class WaitlistService {
  private baseURL: string;

  constructor() {
    // Use environment variable for API base URL
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  }

  /**
   * Join the waitlist
   * @param request - Waitlist join request data
   * @returns Promise with waitlist response
   */
  async join(request: WaitlistRequest): Promise<WaitlistResponse> {
    try {
      const url = `${this.baseURL}/api/waitlist/join`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Waitlist join failed:', error);
      throw error;
    }
  }

  /**
   * Mock implementation for development/testing
   * @param request - Waitlist join request data
   * @returns Promise with mock waitlist response
   */
  async joinMock(request: WaitlistRequest): Promise<WaitlistResponse> {
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
      message: 'Successfully joined the waitlist!',
      data: {
        id: 'waitlist-' + Date.now(),
        mobileNumber: request.mobileNumber,
        joinedAt: new Date().toISOString(),
      },
    };
  }
}

export const waitlistService = new WaitlistService();
export { WaitlistService };
