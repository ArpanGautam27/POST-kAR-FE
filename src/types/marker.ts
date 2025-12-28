/**
 * Type definitions for product variants system
 * Based on backend API response structure for markers with variants
 */

/**
 * Variant represents a specific size option within a product type
 * Each variant has its own pricing and stock information
 */
export interface Variant {
    size: 'A5' | 'A4';
    actualPrice: number;
    discountedPrice: number;
    discountPercentage: number;
    inStock: boolean;
    stockQuantity: number;
}

/**
 * ProductType represents different presentation options (Canvas, Poster Cards)
 * Each type can have multiple size variants with different pricing
 */
export interface ProductType {
    type: 'Canvas' | 'Poster Cards';
    positioning: 'premium' | 'mass';
    variants: Variant[];
}

/**
 * Marker is the backend's product representation with variants
 * Maps to the API response from GET /api/markers
 */
export interface Marker {
    markerId: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    markerImageUrl: string;
    productTypes: ProductType[];
}

/**
 * Helper function to get the lowest price across all variants
 */
export function getLowestPrice(marker: Marker): number {
    if (!marker.productTypes || marker.productTypes.length === 0) {
        return 0;
    }

    const allPrices = marker.productTypes.flatMap(type =>
        type.variants.map(v => v.discountedPrice)
    );

    return Math.min(...allPrices);
}

/**
 * Helper function to get the maximum discount percentage across all variants
 */
export function getMaxDiscount(marker: Marker): number {
    if (!marker.productTypes || marker.productTypes.length === 0) {
        return 0;
    }

    const allDiscounts = marker.productTypes.flatMap(type =>
        type.variants.map(v => v.discountPercentage)
    );

    return Math.max(...allDiscounts);
}

/**
 * Helper function to find a specific variant by product type and size
 */
export function findVariant(
    marker: Marker,
    productType: string,
    size: string
): Variant | null {
    const type = marker.productTypes.find(t => t.type === productType);
    if (!type) return null;

    const variant = type.variants.find(v => v.size === size);
    return variant || null;
}
