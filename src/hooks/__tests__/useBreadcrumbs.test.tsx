import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { useBreadcrumbs } from '../useBreadcrumbs';

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <NavigationProvider>
      {children}
    </NavigationProvider>
  </BrowserRouter>
);

describe('useBreadcrumbs', () => {
  it('should provide breadcrumb functionality', () => {
    const { result } = renderHook(() => useBreadcrumbs(), {
      wrapper: TestWrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current.breadcrumbs).toBeDefined();
    expect(result.current.setBreadcrumbs).toBeDefined();
    expect(result.current.createProductDetailBreadcrumbs).toBeDefined();
    expect(result.current.createScannerBreadcrumbs).toBeDefined();
  });

  it('should create product detail breadcrumbs correctly', () => {
    const { result } = renderHook(() => useBreadcrumbs(), {
      wrapper: TestWrapper,
    });

    const breadcrumbs = result.current.createProductDetailBreadcrumbs('Test Product');
    
    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0]).toEqual({
      label: 'Products',
      path: '/products',
      isActive: false
    });
    expect(breadcrumbs[1]).toEqual({
      label: 'Test Product',
      path: window.location.pathname,
      isActive: true
    });
  });

  it('should create scanner breadcrumbs correctly', () => {
    const { result } = renderHook(() => useBreadcrumbs(), {
      wrapper: TestWrapper,
    });

    const breadcrumbs = result.current.createScannerBreadcrumbs('product-123');
    
    expect(breadcrumbs).toHaveLength(3);
    expect(breadcrumbs[0]).toEqual({
      label: 'Products',
      path: '/products',
      isActive: false
    });
    expect(breadcrumbs[1]).toEqual({
      label: 'Product Detail',
      path: '/product/product-123',
      isActive: false
    });
    expect(breadcrumbs[2]).toEqual({
      label: 'Scanner',
      path: '/scanner/scan.html',
      isActive: true
    });
  });
});