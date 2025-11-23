import { config } from '../config/environment';

export interface OrderItem {
  id: string;
  name: string;
  thumbnail_url: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  status: 'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  placedAt: string;
  eta?: string;
  address: OrderAddress;
  email: string;
  items: OrderItem[];
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
    currency: string;
  };
}

export interface CreateOrderRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  address: OrderAddress;
  email: string;
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
      const response = await fetch(`${this.baseUrl}/api/orders`, {
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
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get all user's orders
   */
  async getOrders(): Promise<OrdersListResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/orders`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
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
