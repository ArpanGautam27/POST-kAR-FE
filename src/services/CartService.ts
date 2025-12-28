import type { Product } from '../types';
import { config } from '../config/environment';

/**
 * Cart item with variant information
 * Matches backend API response structure
 */
export interface CartItemData {
  markerId: string;
  markerName: string;
  thumbnailUrl: string;
  productType: string;
  size: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  productType?: string;
  size?: string;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data?: {
    items: CartItemData[];
    totalAmount: number;
    currency: string;
  };
  error?: string;
}

export interface AddToCartRequest {
  markerId: string;
  productType: string;
  size: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productType: string;
  size: string;
  quantity: number;
}

/**
 * Cart Service - Handles shopping cart operations
 * Integrates with backend Cart API
 */
export class CartService {
  private static instance: CartService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
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
   * Get user's cart
   */
  async getCart(): Promise<CartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cart`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  /**
   * Add item to cart with variant information
   */
  async addToCart(request: AddToCartRequest): Promise<CartResponse> {
    try {
      console.log('🛒 Adding to cart:', request);
      const response = await fetch(`${this.baseUrl}/api/cart/items`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Added to cart:', result);
      return result;
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      throw error;
    }
  }

  /**
   * Update cart item quantity with variant information
   */
  async updateCartItem(markerId: string, request: UpdateCartItemRequest): Promise<CartResponse> {
    try {
      console.log(`🔄 Updating cart item ${markerId}:`, request);
      const response = await fetch(`${this.baseUrl}/api/cart/items/${markerId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Updated cart item:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error updating cart item ${markerId}:`, error);
      throw error;
    }
  }

  /**
   * Remove item from cart with variant information
   * @param markerId - The marker/product ID
   * @param productType - The product type (Canvas, Poster Cards)
   * @param size - The size (A5, A4)
   */
  async removeFromCart(markerId: string, productType: string, size: string): Promise<CartResponse> {
    try {
      const encodedType = encodeURIComponent(productType);
      const encodedSize = encodeURIComponent(size);
      const url = `${this.baseUrl}/api/cart/items/${markerId}/${encodedType}/${encodedSize}`;

      console.log(`🗑️ Removing from cart: ${url}`);
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Removed from cart:', result);
      return result;
    } catch (error) {
      console.error(`❌ Error removing cart item:`, error);
      throw error;
    }
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<CartResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cart`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
}

export const cartService = CartService.getInstance();
