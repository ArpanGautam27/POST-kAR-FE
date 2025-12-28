// Core type definitions for the AR Product Experience application

// Export marker types for variant support
export * from './marker';

/**
 * Product interface representing a product in the system
 * Based on requirements 6.1, 6.3 - mock data structure that simulates API response
 * Extended with optional variant data for new variant selection system
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  thumbnail_url: string;
  image_url: string;
  image_id: string;
  video_url: string;
  metadata?: {
    category?: string;
    tags?: string[];
    created_at?: string;
  };
  // Variant support - optional for backward compatibility
  productTypes?: import('./marker').ProductType[];
}

/**
 * Breadcrumb item for navigation
 */
export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

/**
 * Navigation state for managing application navigation
 * Based on design requirements for client-side routing and navigation
 */
export interface NavigationState {
  currentPage: string;
  previousPage?: string;
  breadcrumbs: BreadcrumbItem[];
}

/**
 * API Response types for future integration
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ProductsResponse extends ApiResponse<Product[]> { }

export interface ProductResponse extends ApiResponse<Product> { }

export interface MediaResponse extends ApiResponse<{
  url: string;
  type: 'image' | 'video';
  metadata?: Record<string, any>;
}> { }

/**
 * Loading and error states
 */
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

/**
 * Component prop types
 */
export interface ProductCardProps {
  product: Product;
  onClick: (productId: string) => void;
  loading?: boolean;
  comingSoon?: boolean;
  hideCart?: boolean;
  hidePrice?: boolean;
}

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onProductClick: (productId: string) => void;
  cardProps?: Partial<ProductCardProps>;
  horizontal?: boolean;
  forceFourColumns?: boolean;
  showArrows?: boolean;
}

export interface ProductDetailProps {
  product: Product;
  onScanClick: () => void;
  onBackClick: () => void;
}

/**
 * Route parameters
 */
export interface ProductDetailParams {
  id: string;
}