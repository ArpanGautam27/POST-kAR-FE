import type { Product } from '../types';
import { config } from '../config/environment';
import { mockProductService } from './MockProductService';

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
    console.log('🔵 [ProductService] getProducts() called');
    console.log('🔵 [ProductService] Base URL:', this.baseUrl);
    console.log('🔵 [ProductService] Mock data enabled:', config.enableMockData);
    
    // Use mock data if enabled
    if (config.enableMockData) {
      console.log('⚠️ [ProductService] Using mock data for products');
      return mockProductService.getProducts();
    }

    const url = `${this.baseUrl}/api/markers?page=0&size=100`;
    console.log('🌐 [ProductService] Fetching from:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 [ProductService] Response status:', response.status, response.statusText);

      if (!response.ok) {
        console.error('❌ [ProductService] HTTP error! status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ [ProductService] Response data:', data);

      // Backend returns paginated response with 'content' array
      if (data.content && Array.isArray(data.content)) {
        console.log('✅ [ProductService] Found', data.content.length, 'products in content array');
        return data.content.map((marker: any) => this.mapMarkerToProduct(marker));
      } else if (Array.isArray(data)) {
        console.log('✅ [ProductService] Found', data.length, 'products (direct array)');
        return data.map((marker: any) => this.mapMarkerToProduct(marker));
      } else {
        console.error('❌ [ProductService] Invalid response format:', data);
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('❌ [ProductService] Error fetching products from API:', error);
      console.error('❌ [ProductService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      console.warn('⚠️ [ProductService] Falling back to mock data');
      return mockProductService.getProducts();
    }
  }

  /**
   * Get a specific product by ID from backend API
   */
  async getProduct(id: string): Promise<Product | null> {
    console.log('🔵 [ProductService] getProduct() called for ID:', id);
    console.log('🔵 [ProductService] Base URL:', this.baseUrl);
    console.log('🔵 [ProductService] Mock data enabled:', config.enableMockData);
    
    // Use mock data if enabled
    if (config.enableMockData) {
      console.log(`⚠️ [ProductService] Using mock data for product ${id}`);
      return mockProductService.getProduct(id);
    }

    const url = `${this.baseUrl}/api/markers/${id}`;
    console.log('🌐 [ProductService] Fetching from:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 [ProductService] Response status:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ [ProductService] Product not found (404):', id);
          return null;
        }
        console.error('❌ [ProductService] HTTP error! status:', response.status);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ [ProductService] Response data:', data);

      // Backend returns Marker object directly
      if (data) {
        const mapped = this.mapMarkerToProduct(data);
        console.log('✅ [ProductService] Mapped product:', mapped);
        return mapped;
      } else {
        console.error('❌ [ProductService] Invalid product response format:', data);
        throw new Error('Invalid product response format');
      }
    } catch (error) {
      console.error(`❌ [ProductService] Error fetching product ${id}:`, error);
      console.error('❌ [ProductService] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      console.warn(`⚠️ [ProductService] Falling back to mock data for product ${id}`);
      return mockProductService.getProduct(id);
    }
  }
  /**
   * Search products by query
   */
  async searchProducts(query: string): Promise<Product[]> {
    // Use mock data if enabled - simple filter on name/description
    if (config.enableMockData) {
      console.log(`Using mock data for product search: ${query}`);
      const allProducts = await mockProductService.getProducts();
      const lowerQuery = query.toLowerCase();
      return allProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      );
    }

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
      console.error('Error searching products, falling back to mock data:', error);
      // Fallback to mock data on error
      const allProducts = await mockProductService.getProducts();
      const lowerQuery = query.toLowerCase();
      return allProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery)
      );
    }
  }
}

export const productService = ProductService.getInstance();
