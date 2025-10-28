import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductGrid } from '../ProductGrid';
import type { Product } from '../../../types';

// Mock ProductCard component
vi.mock('../ProductCard', () => ({
  default: ({ product, onClick, loading }: any) => (
    <div 
      data-testid={loading ? 'product-card-skeleton' : `product-card-${product.id}`}
      onClick={() => !loading && onClick(product.id)}
      role="button"
    >
      {loading ? 'Loading...' : product.name}
    </div>
  )
}));

// Mock product data for testing
const mockProducts: Product[] = [
  {
    id: 'product-1',
    name: 'Product 1',
    description: 'Description 1',
    thumbnail_url: 'https://example.com/thumb1.jpg',
    image_url: 'https://example.com/image1.jpg',
    image_id: 'image-1',
    video_url: 'https://example.com/video1.mp4',
    metadata: { category: 'Electronics' }
  },
  {
    id: 'product-2',
    name: 'Product 2',
    description: 'Description 2',
    thumbnail_url: 'https://example.com/thumb2.jpg',
    image_url: 'https://example.com/image2.jpg',
    image_id: 'image-2',
    video_url: 'https://example.com/video2.mp4',
    metadata: { category: 'Fashion' }
  },
  {
    id: 'product-3',
    name: 'Product 3',
    description: 'Description 3',
    thumbnail_url: 'https://example.com/thumb3.jpg',
    image_url: 'https://example.com/image3.jpg',
    image_id: 'image-3',
    video_url: 'https://example.com/video3.mp4',
    metadata: { category: 'Home' }
  }
];

describe('ProductGrid', () => {
  const mockOnProductClick = vi.fn();

  beforeEach(() => {
    mockOnProductClick.mockClear();
  });

  describe('Rendering with Products', () => {
    it('renders all products correctly', () => {
      render(<ProductGrid products={mockProducts} onProductClick={mockOnProductClick} />);
      
      expect(screen.getByTestId('product-card-product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-product-3')).toBeInTheDocument();
      
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
    });

    it('applies correct CSS classes for product grid', () => {
      render(<ProductGrid products={mockProducts} onProductClick={mockOnProductClick} />);
      
      const grid = document.querySelector('.product-grid');
      expect(grid).toBeInTheDocument();
      
      const container = document.querySelector('.product-grid__container');
      expect(container).toBeInTheDocument();
    });

    it('passes onProductClick to ProductCard components', async () => {
      const user = userEvent.setup();
      render(<ProductGrid products={mockProducts} onProductClick={mockOnProductClick} />);
      
      const productCard = screen.getByTestId('product-card-product-1');
      await user.click(productCard);
      
      expect(mockOnProductClick).toHaveBeenCalledWith('product-1');
      expect(mockOnProductClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading State', () => {
    it('renders loading skeleton when loading is true', () => {
      render(<ProductGrid products={[]} loading={true} onProductClick={mockOnProductClick} />);
      
      // Should render 8 skeleton cards
      const skeletonCards = screen.getAllByTestId('product-card-skeleton');
      expect(skeletonCards).toHaveLength(8);
      
      // Should show loading text
      expect(screen.getAllByText('Loading...')).toHaveLength(8);
    });

    it('applies correct CSS classes for loading state', () => {
      render(<ProductGrid products={[]} loading={true} onProductClick={mockOnProductClick} />);
      
      const grid = document.querySelector('.product-grid');
      expect(grid).toBeInTheDocument();
      
      const container = document.querySelector('.product-grid__container');
      expect(container).toBeInTheDocument();
    });

    it('does not render empty state when loading', () => {
      render(<ProductGrid products={[]} loading={true} onProductClick={mockOnProductClick} />);
      
      expect(screen.queryByText('No Products Available')).not.toBeInTheDocument();
    });

    it('skeleton cards do not trigger onClick', async () => {
      const user = userEvent.setup();
      render(<ProductGrid products={[]} loading={true} onProductClick={mockOnProductClick} />);
      
      const skeletonCard = screen.getAllByTestId('product-card-skeleton')[0];
      await user.click(skeletonCard);
      
      expect(mockOnProductClick).not.toHaveBeenCalled();
    });
  });

  describe('Empty State', () => {
    it('renders empty state when no products and not loading', () => {
      render(<ProductGrid products={[]} loading={false} onProductClick={mockOnProductClick} />);
      
      expect(screen.getByText('No Products Available')).toBeInTheDocument();
      expect(screen.getByText('We couldn\'t find any products to display. Please check back later or contact support if this issue persists.')).toBeInTheDocument();
    });

    it('renders empty state when products is undefined', () => {
      render(<ProductGrid products={undefined as any} loading={false} onProductClick={mockOnProductClick} />);
      
      expect(screen.getByText('No Products Available')).toBeInTheDocument();
    });

    it('applies correct CSS classes for empty state', () => {
      render(<ProductGrid products={[]} loading={false} onProductClick={mockOnProductClick} />);
      
      const grid = document.querySelector('.product-grid');
      expect(grid).toBeInTheDocument();
      
      const empty = document.querySelector('.product-grid__empty');
      expect(empty).toBeInTheDocument();
      
      const emptyIcon = document.querySelector('.product-grid__empty-icon');
      expect(emptyIcon).toBeInTheDocument();
      
      const emptyTitle = document.querySelector('.product-grid__empty-title');
      expect(emptyTitle).toBeInTheDocument();
      
      const emptyDescription = document.querySelector('.product-grid__empty-description');
      expect(emptyDescription).toBeInTheDocument();
    });

    it('renders SVG icon in empty state', () => {
      render(<ProductGrid products={[]} loading={false} onProductClick={mockOnProductClick} />);
      
      const svg = document.querySelector('.product-grid__empty-icon svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '64');
      expect(svg).toHaveAttribute('height', '64');
    });
  });

  describe('Responsive Behavior', () => {
    it('handles single product correctly', () => {
      const singleProduct = [mockProducts[0]];
      render(<ProductGrid products={singleProduct} onProductClick={mockOnProductClick} />);
      
      expect(screen.getByTestId('product-card-product-1')).toBeInTheDocument();
      expect(screen.queryByText('No Products Available')).not.toBeInTheDocument();
    });

    it('handles large number of products', () => {
      const manyProducts = Array.from({ length: 20 }, (_, index) => ({
        ...mockProducts[0],
        id: `product-${index + 1}`,
        name: `Product ${index + 1}`
      }));
      
      render(<ProductGrid products={manyProducts} onProductClick={mockOnProductClick} />);
      
      // Should render all products
      manyProducts.forEach((product) => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
      });
    });
  });

  describe('Props Handling', () => {
    it('handles missing loading prop (defaults to false)', () => {
      render(<ProductGrid products={mockProducts} onProductClick={mockOnProductClick} />);
      
      // Should not show loading state
      expect(screen.queryByTestId('product-card-skeleton')).not.toBeInTheDocument();
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    it('handles products prop changes', () => {
      const { rerender } = render(<ProductGrid products={[mockProducts[0]]} onProductClick={mockOnProductClick} />);
      
      expect(screen.getByTestId('product-card-product-1')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-product-2')).not.toBeInTheDocument();
      
      // Update with more products
      rerender(<ProductGrid products={mockProducts} onProductClick={mockOnProductClick} />);
      
      expect(screen.getByTestId('product-card-product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-product-3')).toBeInTheDocument();
    });

    it('handles loading state changes', () => {
      const { rerender } = render(<ProductGrid products={mockProducts} loading={false} onProductClick={mockOnProductClick} />);
      
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-skeleton')).not.toBeInTheDocument();
      
      // Switch to loading
      rerender(<ProductGrid products={mockProducts} loading={true} onProductClick={mockOnProductClick} />);
      
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('product-card-skeleton')).toHaveLength(8);
    });
  });

  describe('States Priority', () => {
    it('loading state takes priority over empty state', () => {
      render(<ProductGrid products={[]} loading={true} onProductClick={mockOnProductClick} />);
      
      expect(screen.getAllByTestId('product-card-skeleton')).toHaveLength(8);
      expect(screen.queryByText('No Products Available')).not.toBeInTheDocument();
    });

    it('loading state takes priority over products', () => {
      render(<ProductGrid products={mockProducts} loading={true} onProductClick={mockOnProductClick} />);
      
      expect(screen.getAllByTestId('product-card-skeleton')).toHaveLength(8);
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
    });
  });
});