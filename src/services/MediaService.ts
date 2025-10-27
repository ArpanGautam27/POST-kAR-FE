import type { MediaResponse } from '../types';
import { config } from '../config/environment';

/**
 * Media Service - Handles image detection and video URL fetching
 * Integrates with backend API for AR scanner functionality
 */
export class MediaService {
  private static instance: MediaService;
  private scannerApiUrl: string;

  private constructor() {
    this.scannerApiUrl = config.scannerApiUrl;
  }

  public static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  /**
   * Detect image and get associated video URL
   * @param imageData Base64 encoded image data from camera
   * @returns Media response with video URL and metadata
   */
  async detectImageAndGetMedia(imageData: string): Promise<MediaResponse> {
    try {
      const response = await fetch(`${this.scannerApiUrl}/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MediaResponse = await response.json();
      
      if (data.success && data.data) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to detect image');
      }
    } catch (error) {
      console.error('Error detecting image:', error);
      throw error;
    }
  }

  /**
   * Get media by image ID
   * @param imageId The image identifier
   * @returns Media response with video URL and metadata
   */
  async getMediaByImageId(imageId: string): Promise<MediaResponse> {
    try {
      const response = await fetch(`${this.scannerApiUrl}/media/${imageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            data: {
              url: '',
              type: 'video'
            },
            success: false,
            error: 'Media not found for this image'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: MediaResponse = await response.json();
      
      if (data.success && data.data) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch media');
      }
    } catch (error) {
      console.error(`Error fetching media for image ${imageId}:`, error);
      throw error;
    }
  }

  /**
   * Upload captured image for processing
   * @param blob Image blob from camera
   * @returns Base64 encoded image string
   */
  async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const mediaService = MediaService.getInstance();
