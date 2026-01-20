import { config } from '../config/environment';

export interface Offer {
    id: number;
    text: string;
    active: boolean;
}

export interface OffersResponse {
    success: boolean;
    data?: Offer[];
    error?: string;
}

/**
 * Offers Service - Handles promotional offers
 * Fetches offers from backend API
 * Note: Design (gradients, colors) is handled in the frontend
 */
export class OffersService {
    private static instance: OffersService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = config.apiBaseUrl;
    }

    public static getInstance(): OffersService {
        if (!OffersService.instance) {
            OffersService.instance = new OffersService();
        }
        return OffersService.instance;
    }

    /**
     * Get all promotional offers
     * Returns only active offers from the backend API
     */
    async getOffers(): Promise<OffersResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/offers`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Filter to only show active offers
            const activeOffers = data.filter((offer: Offer) => offer.active === true);

            return {
                success: true,
                data: activeOffers
            };
        } catch (error) {
            console.error('Error fetching offers:', error);
            // Return default offers as fallback
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                data: this.getDefaultOffers()
            };
        }
    }

    /**
     * Default offers as fallback
     */
    private getDefaultOffers(): Offer[] {
        return [
            { id: 1, text: 'FREE DELIVERY FOR PREPAID ORDERS!', active: true },
            { id: 2, text: 'BUY 5 GET 3 FREE!', active: true },
            { id: 3, text: 'BUY 2 GET 1 FREE!', active: true },
            { id: 4, text: 'BUY 4 GET 2 FREE!', active: true },
            { id: 5, text: 'BUY 6 GET 4 FREE!', active: true },
            { id: 6, text: 'BUY 7 GET 5 FREE!', active: true },
        ];
    }
}

export const offersService = OffersService.getInstance();
