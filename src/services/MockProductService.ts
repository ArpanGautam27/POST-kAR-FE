import type { Product, MediaResponse } from '../types';

/**
 * Mock Product Service
 * Simulates backend API responses for development and testing
 * Based on requirements 6.1, 6.2 - mock data service with realistic product information
 */
export class MockProductService {
  private static instance: MockProductService;
  private products: Product[];

  private constructor() {
    this.products = this.generateMockProducts();
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
   * Generate realistic mock data for 8-12 products with varied categories
   */
  private generateMockProducts(): Product[] {
    return [
      {
        id: 'prod-001',
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear audio quality. Perfect for music lovers and professionals.',
        thumbnail_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
        image_id: 'img-001',
        video_url: 'https://example.com/videos/headphones-demo.mp4',
        metadata: {
          category: 'Electronics',
          tags: ['audio', 'wireless', 'bluetooth'],
          created_at: '2024-01-15T10:00:00Z'
        }
      },
      {
        id: 'prod-002',
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and 7-day battery life. Track your workouts and health metrics with precision.',
        thumbnail_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop',
        image_id: 'img-002',
        video_url: 'https://example.com/videos/smartwatch-demo.mp4',
        metadata: {
          category: 'Electronics',
          tags: ['fitness', 'smartwatch', 'health'],
          created_at: '2024-01-20T14:30:00Z'
        }
      },
      {
        id: 'prod-003',
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable and sustainable organic cotton t-shirt in classic fit. Made from 100% certified organic cotton with eco-friendly dyes.',
        thumbnail_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
        image_id: 'img-003',
        video_url: 'https://example.com/videos/tshirt-demo.mp4',
        metadata: {
          category: 'Fashion',
          tags: ['clothing', 'organic', 'sustainable'],
          created_at: '2024-02-01T09:15:00Z'
        }
      },
      {
        id: 'prod-004',
        name: 'Ceramic Coffee Mug Set',
        description: 'Handcrafted ceramic coffee mug set of 4. Each mug features unique glazing and is microwave and dishwasher safe. Perfect for your morning routine.',
        thumbnail_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop',
        image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=800&h=600&fit=crop',
        image_id: 'img-004',
        video_url: 'https://example.com/videos/mugs-demo.mp4',
        metadata: {
          category: 'Home & Kitchen',
          tags: ['ceramic', 'coffee', 'handcrafted'],
          created_at: '2024-02-05T16:45:00Z'
        }
      },
      {
        id: 'prod-005',
        name: 'Portable Phone Charger',
        description: 'Ultra-compact 10,000mAh portable battery pack with fast charging technology. Charge multiple devices simultaneously with dual USB ports.',
        thumbnail_url: 'https://images.unsplash.com/photo-1609592806596-4d8b5b5e7e0a?w=300&h=300&fit=crop',
        image_url: 'https://images.unsplash.com/photo-1609592806596-4d8b5b5e7e0a?w=800&h=600&fit=crop',
        image_id: 'img-005',
        video_url: 'https://example.com/videos/charger-demo.mp4',
        metadata: {
          category: 'Electronics',
          tags: ['charging', 'portable', 'battery'],
          created_at: '2024-02-10T11:20:00Z'
        }
      },
      {
        id: 'prod-006',
        name: 'Leather Crossbody Bag',
        description: 'Genuine leather crossbody bag with adjustable strap and multiple compartments. Stylish and functional for everyday use.',
        thumbnail_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
        image_id: 'img-006',
        video_url: 'https://example.com/videos/bag-demo.mp4',
        metadata: {
          category: 'Fashion',
          tags: ['leather', 'bag', 'accessories'],
          created_at: '2024-02-15T13:10:00Z'
        }
      },
      {
        id: 'prod-007',
        name: 'Indoor Plant Collection',
        description: 'Curated collection of 3 low-maintenance indoor plants perfect for beginners. Includes care instructions and decorative pots.',
        thumbnail_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop',
        image_url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop',
        image_id: 'img-007',
        video_url: 'https://example.com/videos/plants-demo.mp4',
        metadata: {
          category: 'Home & Garden',
          tags: ['plants', 'indoor', 'decoration'],
          created_at: '2024-02-20T08:30:00Z'
        }
      },
      {
        id: 'prod-008',
        name: 'Wireless Gaming Mouse',
        description: 'High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons. 50-hour battery life for extended gaming sessions.',
        thumbnail_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
        image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
        image_id: 'img-008',
        video_url: 'https://example.com/videos/mouse-demo.mp4',
        metadata: {
          category: 'Electronics',
          tags: ['gaming', 'mouse', 'wireless'],
          created_at: '2024-02-25T15:45:00Z'
        }
      },
      {
        id: 'prod-009',
        name: 'Bamboo Cutting Board Set',
        description: 'Eco-friendly bamboo cutting board set with 3 different sizes. Naturally antimicrobial and gentle on knife blades.',
        thumbnail_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
        image_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
        image_id: 'img-009',
        video_url: 'https://example.com/videos/cutting-board-demo.mp4',
        metadata: {
          category: 'Home & Kitchen',
          tags: ['bamboo', 'cutting board', 'eco-friendly'],
          created_at: '2024-03-01T12:00:00Z'
        }
      },
      {
        id: 'prod-010',
        name: 'Yoga Mat with Alignment Lines',
        description: 'Premium non-slip yoga mat with alignment guides. Made from eco-friendly TPE material, perfect for all yoga practices.',
        thumbnail_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
        image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
        image_id: 'img-010',
        video_url: 'https://example.com/videos/yoga-mat-demo.mp4',
        metadata: {
          category: 'Sports & Fitness',
          tags: ['yoga', 'fitness', 'mat'],
          created_at: '2024-03-05T10:15:00Z'
        }
      }
    ];
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