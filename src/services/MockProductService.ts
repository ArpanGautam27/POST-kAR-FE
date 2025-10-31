import type { Product, MediaResponse } from '../types';
import { products as centralizedProducts } from '../data/products';

/**
 * Mock Product Service
 * Simulates backend API responses for development and testing
 * Now uses centralized product data from src/data/products.ts
 */
export class MockProductService {
  private static instance: MockProductService;
  private products: Product[];

  private constructor() {
    this.products = centralizedProducts;
  }

  public static getInstance(): MockProductService {
    if (!MockProductService.instance) {
      MockProductService.instance = new MockProductService();
    }
    return MockProductService.instance;
  }

  /**
   * Get all products
   * Simulates API call with realistic delay
   */
  async getProducts(): Promise<Product[]> {
    // Simulate network delay
    await this.delay(300);
    return [...this.products];
  }

  /**
   * Get a specific product by ID
   * Implements proper error handling for invalid product IDs
   */
  async getProduct(id: string): Promise<Product | null> {
    // Simulate network delay
    await this.delay(200);
    
    const product = this.products.find(p => p.id === id);
    return product ? { ...product } : null;
  }

  /**
   * Get product media (for future API integration)
   */
  async getProductMedia(imageId: string): Promise<MediaResponse> {
    await this.delay(150);
    
    const product = this.products.find(p => p.image_id === imageId);
    
    if (!product) {
      return {
        data: {
          url: '',
          type: 'image'
        },
        success: false,
        error: 'Media not found'
      };
    }

    return {
      data: {
        url: product.image_url,
        type: 'image',
        metadata: {
          alt: product.name,
          width: 800,
          height: 600
        }
      },
      success: true
    };
  }

  /**
   * Utility method to simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance for easy use
export const mockProductService = MockProductService.getInstance();