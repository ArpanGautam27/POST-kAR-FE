import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '../ProductCard';
import type { Product } from '../../../types';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { beforeEach } from 'vitest';
import { vi } from 'vitest';
import { describe } from 'vitest';

// Mock product data for testing
const mockProduct: Product = {
  id: 'test-product-1',
  name: 'Test Product',
  description: 'This is a test product description',
  thumbnail_url: 'https://example.com/thumbnail.jpg',
  image_url: 'https://example.com/image.jpg',
  image_id: 'test-image-1',
  video_url: 'https://example.com/video.mp4',
  metadata: {
    category: 'Electronics',
    tags: ['test', 'product'],
    created_at: '2024-01-01'
  }
};

const mockProductWithoutMetadata: Product = {
  id: 'test-product-2',
  name: 'Simple Product',
  description: 'Simple product without metadata',
  thumbnail_url: 'https://example.com/simple.jpg',
  image_url: 'https://example.com/simple-large.jpg',
  image_id: 'simple-image',
  video_url: ''
};

describe('ProductCard', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe('Rendering', () => {
    it('renders product information correctly', () => {
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('This is a test product description')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    });

    it('renders product without metadata category', () => {
      render(<ProductCard product={mockProductWithoutMetadata} onClick={mockOnClick} />);
      
      expect(screen.getByText('Simple Product')).toBeInTheDocument();
      expect(screen.getByText('Simple product without metadata')).toBeInTheDocument();
      expect(screen.queryByText('Electronics')).not.toBeInTheDocument();
    });

    it('has proper accessibility attributes', () => {
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-label', 'View details for Test Product');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('renders image with correct attributes', () => {
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const image = screen.getByAltText('Test Product');
      expect(image).toHaveAttribute('src', 'https://example.com/thumbnail.jpg');
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Loading State', () => {
    it('renders loading skeleton when loading prop is true', () => {
      render(<ProductCard product={mockProduct} onClick={mockOnClick} loading={true} />);
      
      expect(screen.queryByText('Test Product')).not.toBeInTheDocument();
      expect(screen.queryByText('This is a test product description')).not.toBeInTheDocument();
      
      const loadingCard = document.querySelector('.product-card--loading');
      expect(loadingCard).toBeInTheDocument();
      
      const imageSkeleton = document.querySelector('.product-card__image-skeleton');
      expect(imageSkeleton).toBeInTheDocument();
      
      const titleSkeleton = document.querySelector('.product-card__title-skeleton');
      expect(titleSkeleton).toBeInTheDocument();
      
      const descriptionSkeleton = document.querySelector('.product-card__description-skeleton');
      expect(descriptionSkeleton).toBeInTheDocument();
    });

    it('does not call onClick when in loading state', async () => {
      const user = userEvent.setup();
      render(<ProductCard product={mockProduct} onClick={mockOnClick} loading={true} />);
      
      const loadingCard = document.querySelector('.product-card--loading');
      if (loadingCard) {
        await user.click(loadingCard);
      }
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Click Handling', () => {
    it('calls onClick with product id when clicked', async () => {
      const user = userEvent.setup();
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button');
      await user.click(card);
      
      expect(mockOnClick).toHaveBeenCalledWith('test-product-1');
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button');
      card.focus();
      await user.keyboard('{Enter}');
      
      expect(mockOnClick).toHaveBeenCalledWith('test-product-1');
    });

    it('calls onClick when Space key is pressed', async () => {
      const user = userEvent.setup();
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button');
      card.focus();
      await user.keyboard(' ');
      
      expect(mockOnClick).toHaveBeenCalledWith('test-product-1');
    });

    it('does not call onClick for other keys', async () => {
      const user = userEvent.setup();
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const card = screen.getByRole('button');
      card.focus();
      await user.keyboard('{Escape}');
      await user.keyboard('{Tab}');
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Image Handling', () => {
    it('shows image skeleton initially', () => {
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const skeleton = document.querySelector('.product-card__image-skeleton');
      expect(skeleton).toBeInTheDocument();
    });

    it('handles image load success', async () => {
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const image = screen.getByAltText('Test Product');
      
      // Simulate image load
      fireEvent.load(image);
      
      await waitFor(() => {
        expect(image).toHaveClass('product-card__image--loaded');
      });
    });

    it('handles image load error', async () => {
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const image = screen.getByAltText('Test Product');
      
      // Simulate image error
      fireEvent.error(image);
      
      await waitFor(() => {
        expect(screen.getByText('Image not available')).toBeInTheDocument();
      });
    });

    it('shows fallback when image fails to load', async () => {
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const image = screen.getByAltText('Test Product');
      fireEvent.error(image);
      
      await waitFor(() => {
        const fallback = document.querySelector('.product-card__image-fallback');
        expect(fallback).toBeInTheDocument();
        expect(screen.getByText('Image not available')).toBeInTheDocument();
      });
    });
  });

  describe('CSS Classes', () => {
    it('applies correct CSS classes', () => {
      render(<ProductCard product={mockProduct} onClick={mockOnClick} />);
      
      const card = document.querySelector('.product-card');
      expect(card).toBeInTheDocument();
      
      const imageContainer = document.querySelector('.product-card__image-container');
      expect(imageContainer).toBeInTheDocument();
      
      const content = document.querySelector('.product-card__content');
      expect(content).toBeInTheDocument();
      
      const title = document.querySelector('.product-card__title');
      expect(title).toBeInTheDocument();
      
      const description = document.querySelector('.product-card__description');
      expect(description).toBeInTheDocument();
      
      const category = document.querySelector('.product-card__category');
      expect(category).toBeInTheDocument();
    });
  });
});