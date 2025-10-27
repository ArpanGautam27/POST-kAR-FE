import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from '../Navigation';
import type { BreadcrumbItem } from '../../../types';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';

// Mock breadcrumb data for testing
const mockBreadcrumbs: BreadcrumbItem[] = [
  { label: 'Products', path: '/products', isActive: false },
  { label: 'Electronics', path: '/products/electronics', isActive: false },
  { label: 'Smartphone', path: '/products/electronics/smartphone', isActive: true }
];

describe('Navigation', () => {
  const mockOnNavigate = vi.fn();
  const mockOnBack = vi.fn();

  beforeEach(() => {
    mockOnNavigate.mockClear();
    mockOnBack.mockClear();
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<Navigation />);

      expect(screen.getByText('PostKar')).toBeInTheDocument();
      expect(screen.getAllByText('Products')).toHaveLength(2); // Desktop and mobile
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders with custom currentPage', () => {
      render(<Navigation currentPage="Product Detail" />);

      expect(screen.getByText('PostKar')).toBeInTheDocument();
      expect(screen.getAllByText('Products')).toHaveLength(2); // Desktop and mobile
    });

    it('applies correct CSS classes', () => {
      render(<Navigation />);

      const header = document.querySelector('.navigation');
      expect(header).toBeInTheDocument();

      const container = document.querySelector('.navigation__container');
      expect(container).toBeInTheDocument();

      const brand = document.querySelector('.navigation__brand');
      expect(brand).toBeInTheDocument();

      const nav = document.querySelector('.navigation__nav');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Brand/Logo', () => {
    it('renders brand logo correctly', () => {
      render(<Navigation onNavigate={mockOnNavigate} />);

      const brandButton = screen.getByLabelText('Go to products page');
      expect(brandButton).toBeInTheDocument();
      expect(screen.getByText('PostKar')).toBeInTheDocument();
    });

    it('calls onNavigate when brand is clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation onNavigate={mockOnNavigate} />);

      const brandButton = screen.getByLabelText('Go to products page');
      await user.click(brandButton);

      expect(mockOnNavigate).toHaveBeenCalledWith('/products');
      expect(mockOnNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Desktop Navigation', () => {
    it('renders desktop navigation menu', () => {
      render(<Navigation />);

      const nav = screen.getByLabelText('Main navigation');
      expect(nav).toBeInTheDocument();

      const productsLinks = screen.getAllByRole('button', { name: 'Products' });
      expect(productsLinks).toHaveLength(2); // Desktop and mobile

      // Find the desktop navigation link specifically
      const desktopProductsLink = productsLinks.find(link =>
        link.closest('.navigation__nav')
      );
      expect(desktopProductsLink).toBeInTheDocument();
    });

    it('highlights active page in desktop navigation', () => {
      render(<Navigation currentPage="Products" />);

      const productsLinks = screen.getAllByRole('button', { name: 'Products' });
      const desktopProductsLink = productsLinks.find(link =>
        link.closest('.navigation__nav')
      );
      expect(desktopProductsLink).toHaveClass('navigation__nav-link--active');
    });

    it('calls onNavigate when desktop Products link is clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation onNavigate={mockOnNavigate} />);

      const productsLinks = screen.getAllByRole('button', { name: 'Products' });
      const desktopProductsLink = productsLinks.find(link =>
        link.closest('.navigation__nav')
      );
      await user.click(desktopProductsLink!);

      expect(mockOnNavigate).toHaveBeenCalledWith('/products');
    });
  });

  describe('Back Button', () => {
    it('does not render back button by default', () => {
      render(<Navigation />);

      expect(screen.queryByLabelText('Go back')).not.toBeInTheDocument();
    });

    it('renders back button when showBackButton is true', () => {
      render(<Navigation showBackButton={true} onBack={mockOnBack} />);

      const backButton = screen.getByLabelText('Go back');
      expect(backButton).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('calls onBack when back button is clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation showBackButton={true} onBack={mockOnBack} />);

      const backButton = screen.getByLabelText('Go back');
      await user.click(backButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('renders back button SVG icon', () => {
      render(<Navigation showBackButton={true} onBack={mockOnBack} />);

      const backButton = screen.getByLabelText('Go back');
      const svg = backButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '20');
      expect(svg).toHaveAttribute('height', '20');
    });
  });

  describe('Mobile Menu', () => {
    it('renders mobile menu toggle button', () => {
      render(<Navigation />);

      const toggleButton = screen.getByLabelText('Open menu');
      expect(toggleButton).toBeInTheDocument();

      const hamburger = document.querySelector('.navigation__hamburger');
      expect(hamburger).toBeInTheDocument();
    });

    it('toggles mobile menu when button is clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const toggleButton = screen.getByLabelText('Open menu');

      // Initially closed
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

      // Click to open
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
      expect(toggleButton).toHaveAttribute('aria-label', 'Close menu');

      // Click to close
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
      expect(toggleButton).toHaveAttribute('aria-label', 'Open menu');
    });

    it('applies correct CSS classes when mobile menu is open', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const toggleButton = screen.getByLabelText('Open menu');
      await user.click(toggleButton);

      const mobileMenu = document.querySelector('.navigation__mobile-menu--open');
      expect(mobileMenu).toBeInTheDocument();

      const hamburger = document.querySelector('.navigation__hamburger--open');
      expect(hamburger).toBeInTheDocument();

      const overlay = document.querySelector('.navigation__overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('renders mobile navigation menu', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const toggleButton = screen.getByLabelText('Open menu');
      await user.click(toggleButton);

      const mobileNav = screen.getByLabelText('Mobile navigation');
      expect(mobileNav).toBeInTheDocument();
    });

    it('closes mobile menu when overlay is clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const toggleButton = screen.getByLabelText('Open menu');
      await user.click(toggleButton);

      const overlay = document.querySelector('.navigation__overlay');
      expect(overlay).toBeInTheDocument();

      fireEvent.click(overlay!);

      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('calls onNavigate and closes menu when mobile Products link is clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation onNavigate={mockOnNavigate} />);

      const toggleButton = screen.getByLabelText('Open menu');
      await user.click(toggleButton);

      // Find the mobile Products link (there will be two Products buttons - desktop and mobile)
      const mobileProductsLinks = screen.getAllByRole('button', { name: 'Products' });
      const mobileProductsLink = mobileProductsLinks.find(link =>
        link.closest('.navigation__mobile-nav')
      );

      expect(mobileProductsLink).toBeInTheDocument();
      await user.click(mobileProductsLink!);

      expect(mockOnNavigate).toHaveBeenCalledWith('/products');
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows back button in mobile menu when showBackButton is true', async () => {
      const user = userEvent.setup();
      render(<Navigation showBackButton={true} onBack={mockOnBack} />);

      const toggleButton = screen.getByLabelText('Open menu');
      await user.click(toggleButton);

      const mobileBackButton = screen.getByRole('button', { name: '← Back' });
      expect(mobileBackButton).toBeInTheDocument();
    });

    it('calls onBack and closes menu when mobile back button is clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation showBackButton={true} onBack={mockOnBack} />);

      const toggleButton = screen.getByLabelText('Open menu');
      await user.click(toggleButton);

      const mobileBackButton = screen.getByRole('button', { name: '← Back' });
      await user.click(mobileBackButton);

      expect(mockOnBack).toHaveBeenCalledTimes(1);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Breadcrumbs', () => {
    it('does not render breadcrumbs when empty array', () => {
      render(<Navigation breadcrumbs={[]} />);

      expect(screen.queryByLabelText('Breadcrumb navigation')).not.toBeInTheDocument();
    });

    it('does not render breadcrumbs by default', () => {
      render(<Navigation />);

      expect(screen.queryByLabelText('Breadcrumb navigation')).not.toBeInTheDocument();
    });

    it('renders breadcrumbs when provided', () => {
      render(<Navigation breadcrumbs={mockBreadcrumbs} onNavigate={mockOnNavigate} />);

      const breadcrumbNav = screen.getByLabelText('Breadcrumb navigation');
      expect(breadcrumbNav).toBeInTheDocument();

      // Should have Products in navigation (2) + breadcrumbs (1) = 3 total
      expect(screen.getAllByText('Products')).toHaveLength(3);
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Smartphone')).toBeInTheDocument();
    });

    it('renders active breadcrumb correctly', () => {
      render(<Navigation breadcrumbs={mockBreadcrumbs} onNavigate={mockOnNavigate} />);

      const activeCrumb = screen.getByText('Smartphone');
      expect(activeCrumb).toHaveAttribute('aria-current', 'page');
      expect(activeCrumb.tagName).toBe('SPAN');
    });

    it('renders non-active breadcrumbs as clickable buttons', () => {
      render(<Navigation breadcrumbs={mockBreadcrumbs} onNavigate={mockOnNavigate} />);

      const allProductsButtons = screen.getAllByRole('button', { name: 'Products' });
      const electronicsButton = screen.getByRole('button', { name: 'Electronics' });

      // Should have 3 Products buttons: desktop nav, mobile nav, and breadcrumb
      expect(allProductsButtons).toHaveLength(3);
      expect(electronicsButton).toBeInTheDocument();

      // Find the breadcrumb Products button specifically
      const breadcrumbProductsButton = allProductsButtons.find(button =>
        button.closest('.breadcrumbs')
      );
      expect(breadcrumbProductsButton).toBeInTheDocument();
    });

    it('calls onNavigate when breadcrumb link is clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation breadcrumbs={mockBreadcrumbs} onNavigate={mockOnNavigate} />);

      const allProductsButtons = screen.getAllByRole('button', { name: 'Products' });
      const breadcrumbProductsButton = allProductsButtons.find(button =>
        button.closest('.breadcrumbs')
      );

      await user.click(breadcrumbProductsButton!);

      expect(mockOnNavigate).toHaveBeenCalledWith('/products');
    });

    it('renders breadcrumb separators correctly', () => {
      render(<Navigation breadcrumbs={mockBreadcrumbs} onNavigate={mockOnNavigate} />);

      const separators = document.querySelectorAll('.breadcrumbs__separator');
      // Should have 2 separators for 3 breadcrumbs (between items, not after last)
      expect(separators).toHaveLength(2);

      separators.forEach(separator => {
        expect(separator).toHaveTextContent('/');
        expect(separator).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('applies correct CSS classes for breadcrumbs', () => {
      render(<Navigation breadcrumbs={mockBreadcrumbs} onNavigate={mockOnNavigate} />);

      const breadcrumbsContainer = document.querySelector('.navigation__breadcrumbs');
      expect(breadcrumbsContainer).toBeInTheDocument();

      const breadcrumbsList = document.querySelector('.breadcrumbs');
      expect(breadcrumbsList).toBeInTheDocument();

      const breadcrumbItems = document.querySelectorAll('.breadcrumbs__item');
      expect(breadcrumbItems).toHaveLength(3);

      const currentCrumb = document.querySelector('.breadcrumbs__current');
      expect(currentCrumb).toBeInTheDocument();

      const breadcrumbLinks = document.querySelectorAll('.breadcrumbs__link');
      expect(breadcrumbLinks).toHaveLength(2); // Two non-active items
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<Navigation showBackButton={true} breadcrumbs={mockBreadcrumbs} />);

      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Go to products page')).toBeInTheDocument();
      expect(screen.getByLabelText('Go back')).toBeInTheDocument();
      expect(screen.getByLabelText('Breadcrumb navigation')).toBeInTheDocument();
    });

    it('manages mobile menu ARIA attributes correctly', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const toggleButton = screen.getByLabelText('Open menu');

      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('has proper mobile navigation ARIA label', async () => {
      const user = userEvent.setup();
      render(<Navigation />);

      const toggleButton = screen.getByLabelText('Open menu');
      await user.click(toggleButton);

      expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('maintains mobile menu state correctly', async () => {
      const user = userEvent.setup();
      render(<Navigation onNavigate={mockOnNavigate} />);

      const toggleButton = screen.getByLabelText('Open menu');

      // Open menu
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

      // Navigate and menu should close
      const mobileProductsLinks = screen.getAllByRole('button', { name: 'Products' });
      const mobileProductsLink = mobileProductsLinks.find(link =>
        link.closest('.navigation__mobile-nav')
      );
      await user.click(mobileProductsLink!);

      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes mobile menu when back button is used', async () => {
      const user = userEvent.setup();
      render(<Navigation showBackButton={true} onBack={mockOnBack} />);

      const toggleButton = screen.getByLabelText('Open menu');

      // Open menu
      await user.click(toggleButton);
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

      // Use back button and menu should close
      const mobileBackButton = screen.getByRole('button', { name: '← Back' });
      await user.click(mobileBackButton);

      expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    });
  });
});