import type { Product, ProductsResponse, ProductResponse } from '../types';
import { config } from '../config/environment';

/**
 * Product Service - Real API Integration
 * Handles fetching products from backend API with fallback to mock data
 */
export class ProductService {
  private static instance: ProductService;
  private baseUrl: string;
  private apiVersion: string;

  private constructor() {
    this.baseUrl = config.apiBaseUrl;
    this.apiVersion = config.apiVersion;
  }

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Get all products from backend API
   */
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.apiVersion}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products from API:', error);
      throw error;
    }
  }

  /**
   * Get a specific product by ID from backend API
   */
  async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.apiVersion}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductResponse = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to fetch product');
      }
    } catch (error) {
      console.error(`Error fetching product ${id} from API:`, error);
      throw error;
    }
  }

  /**
   * Search products by query
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.apiVersion}/products/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();
      
      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to search products');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

export const productService = ProductService.getInstance();
