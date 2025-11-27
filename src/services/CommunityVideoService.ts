import { config } from '../config/environment';

export interface CommunityVideo {
  id: string;
  url: string;
  title?: string;
  thumbnail?: string;
}

/**
 * Community Video Service - Fetches community videos from Cloudflare
 * Replaces local video imports with CDN-hosted videos
 */
export class CommunityVideoService {
  private static instance: CommunityVideoService;
  private cloudflareVideoUrl: string;
  
  // Community video IDs hosted on Cloudflare
  private videoIds = [
    'customer_feedback_1',
    'customer_feedback_2',
    'customer_feedback_3',
    'customer_feedback_4',
    'customer_feedback_5',
    'customer_feedback_6',
    'customer_feedback_7',
    'customer_feedback_8',
    'customer_feedback_9',
    'customer_feedback_10',
    'customer_feedback_11',
  ];

  private constructor() {
    this.cloudflareVideoUrl = config.cloudflareVideoUrl;
  }

  public static getInstance(): CommunityVideoService {
    if (!CommunityVideoService.instance) {
      CommunityVideoService.instance = new CommunityVideoService();
    }
    return CommunityVideoService.instance;
  }

  /**
   * Get all community videos in the specified order
   * @returns Array of community video URLs in order: [1, 3, 5, 8, 4, 2, 6, 7, 9, 10, 11]
   */
  async getCommunityVideos(): Promise<string[]> {
    try {
      // Order: cf1, cf3, cf5, cf8, cf4, cf2, cf6, cf7, cf9, cf10, cf11
      const order = [0, 2, 4, 7, 3, 1, 5, 6, 8, 9, 10]; // indices for the specified order
      
      const videos = order.map(idx => {
        const videoId = this.videoIds[idx];
        return `${this.cloudflareVideoUrl}/${videoId}.mp4`;
      });

      return videos;
    } catch (error) {
      console.error('Error fetching community videos:', error);
      throw error;
    }
  }

  /**
   * Get a single community video by ID
   * @param videoId The video identifier
   * @returns Full URL to the video
   */
  getVideoUrl(videoId: string): string {
    return `${this.cloudflareVideoUrl}/${videoId}.mp4`;
  }

  /**
   * Get community videos with metadata
   * @returns Array of community video objects with URL and metadata
   */
  async getCommunityVideosWithMetadata(): Promise<CommunityVideo[]> {
    try {
      const order = [0, 2, 4, 7, 3, 1, 5, 6, 8, 9, 10];
      
      const videos = order.map((idx, position) => {
        const videoId = this.videoIds[idx];
        return {
          id: videoId,
          url: `${this.cloudflareVideoUrl}/${videoId}.mp4`,
          title: `Customer Feedback ${position + 1}`,
        };
      });

      return videos;
    } catch (error) {
      console.error('Error fetching community videos with metadata:', error);
      throw error;
    }
  }
}

export const communityVideoService = CommunityVideoService.getInstance();
