import { config } from '../config/environment';

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface CreateAddressRequest {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {}

export interface AddressResponse {
  success: boolean;
  data?: Address;
  error?: string;
}

export interface AddressesListResponse {
  success: boolean;
  data?: Address[];
  error?: string;
}

/**
 * Address Service - Handles user address operations
 * Integrates with backend Addresses API
 */
export class AddressService {
  private static instance: AddressService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  public static getInstance(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService();
    }
    return AddressService.instance;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('postkar-auth-token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Get all user's addresses
   */
  async getAddresses(): Promise<AddressesListResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/addresses`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  }

  /**
   * Create new address
   */
  async createAddress(request: CreateAddressRequest): Promise<AddressResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/addresses`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  /**
   * Update address by ID
   */
  async updateAddress(addressId: string, request: UpdateAddressRequest): Promise<AddressResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/addresses/${addressId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error updating address ${addressId}:`, error);
      throw error;
    }
  }

  /**
   * Delete address by ID
   */
  async deleteAddress(addressId: string): Promise<AddressResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/addresses/${addressId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error deleting address ${addressId}:`, error);
      throw error;
    }
  }
}

export const addressService = AddressService.getInstance();
