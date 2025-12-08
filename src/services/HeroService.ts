import { config } from '../config/environment';
import { mockHeroService } from './MockHeroService';

export interface HeroImage {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
}

export interface HeroResponse {
  success: boolean;
  data?: HeroImage[];
  error?: string;
}

/**
 * Hero Service - Handles hero section images
 * Fetches random hero images from backend API
 */
export class HeroService {
  private static instance: HeroService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  public static getInstance(): HeroService {
    if (!HeroService.instance) {
      HeroService.instance = new HeroService();
    }
    return HeroService.instance;
  }

  /**
   * Get random hero images
   * Returns 10 random hero images from the database
   */
  async getHeroImages(): Promise<HeroResponse> {
    // Use mock data if enabled
    if (config.enableMockData) {
      console.log('Using mock data for hero images');
      return mockHeroService.getHeroImages();
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/hero`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching hero images, falling back to mock data:', error);
      // Fallback to mock data on error
      return mockHeroService.getHeroImages();
    }
  }
}

export const heroService = HeroService.getInstance();
