import type { Category, Product } from '../types';
import { config } from '../config/environment';

/**
 * Category Service - API Integration
 * Handles fetching categories and markers by category from backend API
 */
export class CategoryService {
    private static instance: CategoryService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = config.apiBaseUrl;
    }

    public static getInstance(): CategoryService {
        if (!CategoryService.instance) {
            CategoryService.instance = new CategoryService();
        }
        return CategoryService.instance;
    }

    /**
     * Get all categories from backend API
     */
    async getAllCategories(): Promise<Category[]> {
        console.log('🔵 [CategoryService] getAllCategories() called');
        console.log('🔵 [CategoryService] Base URL:', this.baseUrl);

        const url = `${this.baseUrl}/api/categories`;
        console.log('🌐 [CategoryService] Fetching from:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('📡 [CategoryService] Response status:', response.status, response.statusText);

            if (!response.ok) {
                console.error('❌ [CategoryService] HTTP error! status:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ [CategoryService] Response data:', data);

            if (Array.isArray(data)) {
                console.log('✅ [CategoryService] Found', data.length, 'categories');
                return data as Category[];
            } else {
                console.error('❌ [CategoryService] Invalid response format:', data);
                throw new Error('Invalid response format from API');
            }
        } catch (error) {
            console.error('❌ [CategoryService] Error fetching categories from API:', error);
            console.error('❌ [CategoryService] Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                name: error instanceof Error ? error.name : 'Unknown',
                stack: error instanceof Error ? error.stack : 'No stack'
            });
            // Return empty array on error
            console.warn('⚠️ [CategoryService] Returning empty categories array');
            return [];
        }
    }

    /**
     * Get markers for a specific category
     */
    async getMarkersByCategory(categoryId: string): Promise<Product[]> {
        console.log('🔵 [CategoryService] getMarkersByCategory() called for:', categoryId);
        console.log('🔵 [CategoryService] Base URL:', this.baseUrl);

        const url = `${this.baseUrl}/api/markers/category/${categoryId}`;
        console.log('🌐 [CategoryService] Fetching from:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('📡 [CategoryService] Response status:', response.status, response.statusText);

            if (!response.ok) {
                console.error('❌ [CategoryService] HTTP error! status:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ [CategoryService] Response data:', data);

            if (Array.isArray(data)) {
                console.log('✅ [CategoryService] Found', data.length, 'markers in category');
                // Map backend Marker objects to Product shape
                return data.map((marker: any) => this.mapMarkerToProduct(marker));
            } else {
                console.error('❌ [CategoryService] Invalid response format:', data);
                throw new Error('Invalid response format from API');
            }
        } catch (error) {
            console.error(`❌ [CategoryService] Error fetching markers for category ${categoryId}:`, error);
            console.error('❌ [CategoryService] Error details:', {
                message: error instanceof Error ? error.message : 'Unknown error',
                name: error instanceof Error ? error.name : 'Unknown',
                stack: error instanceof Error ? error.stack : 'No stack'
            });
            // Return empty array on error
            console.warn('⚠️ [CategoryService] Returning empty markers array');
            return [];
        }
    }

    /**
     * Get category details by ID
     */
    async getCategoryById(categoryId: string): Promise<Category | null> {
        console.log('🔵 [CategoryService] getCategoryById() called for:', categoryId);

        const url = `${this.baseUrl}/api/categories/${categoryId}`;
        console.log('🌐 [CategoryService] Fetching from:', url);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('⚠️ [CategoryService] Category not found (404):', categoryId);
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ [CategoryService] Category data:', data);
            return data as Category;
        } catch (error) {
            console.error(`❌ [CategoryService] Error fetching category ${categoryId}:`, error);
            return null;
        }
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

        // Extract productTypes for variant support
        const productTypes = marker.productTypes || [];

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
            productTypes, // Include variant data
        };
    }
}

export const categoryService = CategoryService.getInstance();
