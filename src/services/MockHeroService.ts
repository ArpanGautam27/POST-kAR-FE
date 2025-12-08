import type { HeroImage, HeroResponse } from './HeroService';

/**
 * Mock Hero Service
 * Provides mock hero images for development and testing
 */
export class MockHeroService {
  private static instance: MockHeroService;
  private heroImages: HeroImage[];

  private constructor() {
    // Generate mock hero images
    this.heroImages = [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
        title: 'Cultural Heritage',
        description: 'Explore traditional art through AR'
      },
      {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        title: 'Modern Storytelling',
        description: 'Connect with stories in new ways'
      },
      {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        title: 'Interactive Experiences',
        description: 'Scan and discover hidden content'
      },
      {
        id: '4',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
        title: 'Augmented Reality',
        description: 'Transform posters into living stories'
      },
      {
        id: '5',
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
        title: 'Digital Art',
        description: 'Experience art in immersive ways'
      },
      {
        id: '6',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
        title: 'Cultural Innovation',
        description: 'Preserving tradition with technology'
      },
      {
        id: '7',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
        title: 'Immersive Content',
        description: 'Unlock hidden layers of meaning'
      },
      {
        id: '8',
        imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
        title: 'Interactive Posters',
        description: 'Turn static images into dynamic experiences'
      },
      {
        id: '9',
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
        title: 'AR Innovation',
        description: 'Next generation of storytelling'
      },
      {
        id: '10',
        imageUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=80',
        title: 'Digital Heritage',
        description: 'Bridge past and future with AR'
      }
    ];
  }

  public static getInstance(): MockHeroService {
    if (!MockHeroService.instance) {
      MockHeroService.instance = new MockHeroService();
    }
    return MockHeroService.instance;
  }

  /**
   * Get random hero images
   * Simulates API call with realistic delay
   */
  async getHeroImages(): Promise<HeroResponse> {
    // Simulate network delay
    await this.delay(300);
    
    // Return randomized subset of images (like the real API)
    const shuffled = [...this.heroImages].sort(() => Math.random() - 0.5);
    
    return {
      success: true,
      data: shuffled
    };
  }

  /**
   * Utility method to simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const mockHeroService = MockHeroService.getInstance();
