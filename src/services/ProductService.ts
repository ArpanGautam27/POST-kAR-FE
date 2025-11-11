import type { Product, ProductsResponse, ProductResponse } from '../types';
import { config } from '../config/environment';
import { getProductImageUrl } from '../config/r2-media';
import { products as mockProducts } from '../data/products';

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
   * Transform product URLs to use R2 CDN instead of API URLs
   */
  private transformProductUrls(product: Product): Product {
    // Extract filename from the product name or use a mapping
    const productMapping: Record<string, string> = {
      'prod-001': 'Amber Tongue Elixir.jpg',
      'prod-002': 'Astral Nataraja Surge.jpg',
      'prod-003': 'Baba Yaga Silhouette.jpg',
      'prod-004': 'Delhi Verse Velocity.webp',
      'prod-005': 'Eternal Strike Zenith.webp',
      'prod-006': 'Gilded Smile Paradox.jpg',
      'prod-007': 'IMG-20250517-WA0034.jpg',
      'prod-008': 'IMG-20250517-WA0048.jpg',
      'prod-009': 'Jetstream Hyperforge.jpg',
      'prod-010': 'Marlboro Mirth Pack.jpg',
      'prod-011': 'Phantom Field Devourer.jpg',
      'prod-012': 'Prancing Heart Ignition.jpg',
      'prod-013': 'Red Devil Dynasty Ember.jpg',
      'prod-014': 'Rubber Dawn Cataclysm.jpg',
      'prod-015': 'Titanium Apex Symphony.jpg',
      'prod-016': 'Urban Chakra Sunrise.jpg',
      'prod-017': 'Verdigris Void Oracle.jpg',
    };

    const filename = productMapping[product.id];
    if (filename) {
      return {
        ...product,
        thumbnail_url: getProductImageUrl(filename),
        image_url: getProductImageUrl(filename),
      };
    }
    return product;
  }

  /**
   * Get all products from backend API with R2 URLs, fallback to mock data
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
        // Transform URLs to use R2
        return data.data.map(product => this.transformProductUrls(product));
      } else {
        throw new Error(data.error || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products from API, using mock data:', error);
      // Fallback to mock data with R2 URLs
      return mockProducts;
    }
  }

  /**
   * Get a specific product by ID from backend API with R2 URLs, fallback to mock data
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
        // Transform URLs to use R2
        return this.transformProductUrls(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch product');
      }
    } catch (error) {
      console.error(`Error fetching product ${id} from API, using mock data:`, error);
      // Fallback to mock data
      return mockProducts.find(p => p.id === id) || null;
    }
  }

  /**
   * Search products by query with R2 URLs, fallback to mock data
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
        // Transform URLs to use R2
        return data.data.map(product => this.transformProductUrls(product));
      } else {
        throw new Error(data.error || 'Failed to search products');
      }
    } catch (error) {
      console.error('Error searching products, using mock data:', error);
      // Fallback to mock data search
      const lowerQuery = query.toLowerCase();
      return mockProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
      );
    }
  }
}

export const productService = ProductService.getInstance();
