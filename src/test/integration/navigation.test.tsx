import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { NavigationProvider } from '../../contexts/NavigationContext';
import ProductsPage from '../../pages/ProductsPage';
import ProductDetailPage from '../../pages/ProductDetailPage';
import ScannerPage from '../../pages/ScannerPage';
import NotFoundPage from '../../pages/NotFoundPage';
import LandingPage from '../../pages/LandingPage';

// Mock the MockProductService to avoid API calls during tests
vi.mock('../../services/MockProductService', () => {
  const mockService = {
    getProducts: vi.fn().mockResolvedValue([
      {
        id: '1',
        name: 'Test Product 1',
        description: 'Test description 1',
        thumbnail_url: 'https://example.com/thumb1.jpg',
        image_url: 'https://example.com/image1.jpg',
        image_id: 'img1',
        video_url: 'https://example.com/video1.mp4'
      },
      {
        id: '2',
        name: 'Test Product 2',
        description: 'Test description 2',
        thumbnail_url: 'https://example.com/thumb2.jpg',
        image_url: 'https://example.com/image2.jpg',
        image_id: 'img2',
        video_url: 'https://example.com/video2.mp4'
      }
    ]),
    getProduct: vi.fn().mockImplementation((id: string) => {
      if (id === '1') {
        return Promise.resolve({
          id: '1',
          name: 'Test Product 1',
          description: 'Test description 1',
          thumbnail_url: 'https://example.com/thumb1.jpg',
          image_url: 'https://example.com/image1.jpg',
          image_id: 'img1',
          video_url: 'https://example.com/video1.mp4'
        });
      }
      return Promise.resolve(null);
    })
  };

  return {
    MockProductService: {
      getInstance: vi.fn().mockReturnValue(mockService)
    },
    mockProductService: mockService
  };
});

// Helper component to wrap routes with NavigationProvider
const TestApp = ({ children }: { children: React.ReactNode }) => (
  <NavigationProvider>
    {children}
  </NavigationProvider>
);

describe('Navigation Integration Tests', () => {
  describe('Client-side routing functionality', () => {
    it('should load landing page correctly', async () => {
      const router = createMemoryRouter([
        { 
          path: '/', 
          element: (
            <TestApp>
              <LandingPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      // Should show landing page content
      await waitFor(() => {
        expect(screen.getByText('POST-kAR')).toBeInTheDocument();
        expect(screen.getByText('Experience Culture Through Augmented Reality')).toBeInTheDocument();
      });
    });

    it('should navigate to product detail page when clicking on a product', async () => {
      const router = createMemoryRouter([
        { 
          path: '/products', 
          element: (
            <TestApp>
              <ProductsPage />
            </TestApp>
          )
        },
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/products'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });

      // Click on the first product
      const productCard = screen.getByText('Test Product 1').closest('article');
      expect(productCard).toBeInTheDocument();
      
      await userEvent.click(productCard!);

      // Should navigate to product detail page
      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });
    });

    it('should navigate to scanner page when clicking scan product button', async () => {
      const router = createMemoryRouter([
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        },
        { 
          path: '/scanner/scan.html', 
          element: (
            <TestApp>
              <ScannerPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/product/1'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      // Wait for product detail to load
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });

      // Click scan product button
      const scanButton = screen.getByRole('button', { name: /scan product/i });
      await userEvent.click(scanButton);

      // Should navigate to scanner page
      await waitFor(() => {
        expect(screen.getByText(/AR Scanner/i)).toBeInTheDocument();
      });
    });

    it('should show 404 page for invalid routes', async () => {
      const router = createMemoryRouter([
        { 
          path: '*', 
          element: (
            <TestApp>
              <NotFoundPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/invalid-route'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      // Should show 404 page
      await waitFor(() => {
        expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
      });
    });

    it('should show 404 page for invalid product ID', async () => {
      const router = createMemoryRouter([
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/product/invalid-id'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      // Should show 404 page for invalid product
      await waitFor(() => {
        expect(screen.getByText(/Product Not Found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Browser back/forward button behavior', () => {
    it('should handle browser back button correctly', async () => {
      const router = createMemoryRouter([
        { 
          path: '/products', 
          element: (
            <TestApp>
              <ProductsPage />
            </TestApp>
          )
        },
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/products', '/product/1'],
        initialIndex: 1
      });

      render(<RouterProvider router={router} />);

      // Should start on product detail page
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });

      // Simulate browser back button
      router.navigate(-1);

      await waitFor(() => {
        expect(screen.getByText(/Discover Products/i)).toBeInTheDocument();
      });
    });

    it('should handle browser forward button correctly', async () => {
      const router = createMemoryRouter([
        { 
          path: '/products', 
          element: (
            <TestApp>
              <ProductsPage />
            </TestApp>
          )
        },
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/products', '/product/1'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      // Should start on products page
      await waitFor(() => {
        expect(screen.getByText(/Discover Products/i)).toBeInTheDocument();
      });

      // Simulate browser forward button
      router.navigate(1);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });
    });

    it('should maintain navigation state during browser navigation', async () => {
      const router = createMemoryRouter([
        { 
          path: '/', 
          element: (
            <TestApp>
              <LandingPage />
            </TestApp>
          )
        },
        { 
          path: '/products', 
          element: (
            <TestApp>
              <ProductsPage />
            </TestApp>
          )
        },
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        },
        { 
          path: '/scanner/scan.html', 
          element: (
            <TestApp>
              <ScannerPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/', '/products', '/product/1', '/scanner/scan.html'],
        initialIndex: 3
      });

      render(<RouterProvider router={router} />);

      // Should start on scanner page
      await waitFor(() => {
        expect(screen.getByText(/AR Scanner/i)).toBeInTheDocument();
      });

      // Go back to product detail
      router.navigate(-1);
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });

      // Go back to products
      router.navigate(-1);
      await waitFor(() => {
        expect(screen.getByText(/Discover Products/i)).toBeInTheDocument();
      });

      // Go back to landing
      router.navigate(-1);
      await waitFor(() => {
        expect(screen.getByText('POST-kAR')).toBeInTheDocument();
      });
    });

    it('should handle popstate events correctly', async () => {
      const router = createMemoryRouter([
        { 
          path: '/products', 
          element: (
            <TestApp>
              <ProductsPage />
            </TestApp>
          )
        },
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/products', '/product/1'],
        initialIndex: 1
      });

      render(<RouterProvider router={router} />);

      // Should start on product detail
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });

      // Simulate popstate event (browser back button)
      const popstateEvent = new PopStateEvent('popstate', { state: null });
      router.navigate(-1);
      window.dispatchEvent(popstateEvent);

      await waitFor(() => {
        expect(screen.getByText(/Discover Products/i)).toBeInTheDocument();
      });
    });
  });

  describe('Deep linking and URL bookmarking', () => {
    it('should load products page correctly from direct URL', async () => {
      const router = createMemoryRouter([
        { 
          path: '/products', 
          element: (
            <TestApp>
              <ProductsPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/products'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText(/Discover Products/i)).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });
    });

    it('should load product detail page correctly from direct URL', async () => {
      const router = createMemoryRouter([
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/product/1'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });
    });

    it('should load scanner page correctly from direct URL', async () => {
      const router = createMemoryRouter([
        { 
          path: '/scanner/scan.html', 
          element: (
            <TestApp>
              <ScannerPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/scanner/scan.html'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText(/AR Scanner/i)).toBeInTheDocument();
      });
    });

    it('should handle bookmarked URLs with query parameters', async () => {
      const router = createMemoryRouter([
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/product/1?ref=bookmark'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });
    });

    it('should handle bookmarked URLs with hash fragments', async () => {
      const router = createMemoryRouter([
        { 
          path: '/products', 
          element: (
            <TestApp>
              <ProductsPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/products#featured'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText(/Discover Products/i)).toBeInTheDocument();
      });
    });

    it('should maintain URL state during navigation', async () => {
      const router = createMemoryRouter([
        { 
          path: '/products', 
          element: (
            <TestApp>
              <ProductsPage />
            </TestApp>
          )
        },
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        },
        { 
          path: '/scanner/scan.html', 
          element: (
            <TestApp>
              <ScannerPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/products'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      // Navigate to product detail
      router.navigate('/product/1');
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });

      // Navigate to scanner
      router.navigate('/scanner/scan.html');
      
      await waitFor(() => {
        expect(screen.getByText(/AR Scanner/i)).toBeInTheDocument();
      });
    });

    it('should handle invalid bookmarked product URLs gracefully', async () => {
      const router = createMemoryRouter([
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/product/nonexistent'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      await waitFor(() => {
        expect(screen.getByText(/Product Not Found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation breadcrumbs and state management', () => {
    it('should update breadcrumbs correctly during navigation', async () => {
      const router = createMemoryRouter([
        { 
          path: '/products', 
          element: (
            <TestApp>
              <ProductsPage />
            </TestApp>
          )
        },
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/products'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      // Should show products breadcrumb
      await waitFor(() => {
        expect(screen.getAllByText('Products')[0]).toBeInTheDocument();
      });

      // Navigate to product detail
      await waitFor(() => {
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      });
      
      const productCard = screen.getByText('Test Product 1').closest('article');
      await userEvent.click(productCard!);

      // Should show product detail breadcrumb
      await waitFor(() => {
        expect(screen.getAllByText('Products')[0]).toBeInTheDocument();
        expect(screen.getByText('Product Detail')).toBeInTheDocument();
      });
    });

    it('should handle navigation context state correctly', async () => {
      const router = createMemoryRouter([
        { 
          path: '/products', 
          element: (
            <TestApp>
              <ProductsPage />
            </TestApp>
          )
        },
        { 
          path: '/product/:id', 
          element: (
            <TestApp>
              <ProductDetailPage />
            </TestApp>
          )
        },
        { 
          path: '/scanner/scan.html', 
          element: (
            <TestApp>
              <ScannerPage />
            </TestApp>
          )
        }
      ], {
        initialEntries: ['/products'],
        initialIndex: 0
      });

      render(<RouterProvider router={router} />);

      // Navigate through pages and verify state updates
      router.navigate('/product/1');
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });

      // Navigate to scanner
      router.navigate('/scanner/scan.html');
      
      await waitFor(() => {
        expect(screen.getByText(/AR Scanner/i)).toBeInTheDocument();
      });

      // Use back navigation
      const backButton = screen.getByRole('button', { name: /back/i });
      await userEvent.click(backButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /scan product/i })).toBeInTheDocument();
      });
    });
  });
});