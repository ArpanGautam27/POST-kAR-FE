import type { Product } from '../types';
import { config } from '../config/environment';

/**
 * Product Service - Real API Integration
 * Handles fetching products from backend API with fallback to mock data
 */
export class ProductService {
  private static instance: ProductService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  // Map backend Marker object to frontend Product shape
  private mapMarkerToProduct(marker: any): Product {
    if (!marker) {
      throw new Error('Invalid marker data');
    }

    const id = marker.markerId || marker.id || marker._id || '';
    const name = marker.name || marker.markerId || 'Unknown Marker';
    const description = marker.description || '';

    const thumbnailUrl = marker.thumbnailUrl || marker.markerImageUrl || '';
    const imageUrl = marker.markerImageUrl || marker.thumbnailUrl || '';

    const videos = Array.isArray(marker.videos) ? marker.videos : [];
    const activeVideoId = marker.activeVideoId;
    const activeVideo =
      videos.find((v: any) => v._id === activeVideoId) || videos[0] || null;

    const videoUrl = activeVideo?.videoUrl || '';

    return {
      id,
      name,
      description,
      thumbnail_url: thumbnailUrl,
      image_url: imageUrl,
      image_id: id,
      video_url: videoUrl,
      metadata: {
        created_at: marker.createdAt,
      },
    };
  }

  /**
   * Get all products from backend API
   */
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/markers?page=0&size=100`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Backend returns paginated response with 'content' array
      if (data.content && Array.isArray(data.content)) {
        return data.content.map((marker: any) => this.mapMarkerToProduct(marker));
      } else if (Array.isArray(data)) {
        // Fallback if backend returns array directly
        return data.map((marker: any) => this.mapMarkerToProduct(marker));
      } else {
        throw new Error('Invalid response format from API');
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
      const response = await fetch(`${this.baseUrl}/api/markers/${id}`, {
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

      const data = await response.json();

      // Backend returns Marker object directly
      if (data) {
        return this.mapMarkerToProduct(data);
      } else {
        throw new Error('Invalid product response format');
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
      const response = await fetch(`${this.baseUrl}/api/markers/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Backend returns array of Marker objects directly
      if (Array.isArray(data)) {
        return data.map((marker: any) => this.mapMarkerToProduct(marker));
      } else {
        throw new Error('Invalid search response format');
      }
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }
}

export const productService = ProductService.getInstance();
