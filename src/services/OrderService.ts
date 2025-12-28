import { config } from '../config/environment';

export interface OrderItem {
  markerId: string;
  markerName: string;
  thumbnailUrl: string;
  productType?: string; // e.g., "CANVAS", "POSTER_CARD"
  size?: string; // e.g., "A5", "A4"
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  currency: string;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: 'COD' | 'CARD';
}

export interface OrderResponse {
  success: boolean;
  data?: Order;
  error?: string;
}

export interface OrdersListResponse {
  success: boolean;
  data?: Order[];
  error?: string;
}

/**
 * Order Service - Handles order operations
 * Integrates with backend Orders API
 */
export class OrderService {
  private static instance: OrderService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
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
   * Create a new order (checkout)
   */
  async createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
    try {
      const url = `${this.baseUrl}/api/orders`;
      const headers = this.getAuthHeaders();

      console.log('🌐 OrderService.createOrder called');
      console.log('📍 API URL:', url);
      console.log('🔑 Headers:', headers);
      console.log('📦 Request body:', request);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      console.log('📡 Response status:', response.status, response.statusText);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('✅ API Success response:', responseData);
      return responseData;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get all user's orders
   */
  async getOrders(): Promise<OrdersListResponse> {
    try {
      const url = `${this.baseUrl}/api/orders`;
      const headers = this.getAuthHeaders();

      console.log('🌐 OrderService.getOrders called');
      console.log('📍 API URL:', url);
      console.log('🔑 Headers:', headers);
      console.log('🔑 Token exists:', !!headers['Authorization']);

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 401) {
          console.error('❌ Unauthorized - Token may be invalid or expired');
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Error response:', errorData);
          return {
            success: false,
            error: 'Unauthorized. Please log in again.',
            data: []
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('✅ API Success response:', responseData);
      return responseData;
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        data: []
      };
    }
  }

  /**
   * Get specific order by ID
   */
  async getOrder(orderId: string): Promise<OrderResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/orders/${orderId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: 'Order not found',
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  }
}

export const orderService = OrderService.getInstance();
