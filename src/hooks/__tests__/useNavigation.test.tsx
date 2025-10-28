import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { NavigationProvider } from '../../contexts/NavigationContext';
import { useNavigation } from '../useNavigation';
import { it } from 'node:test';
import { it } from 'node:test';
import { it } from 'node:test';
import { describe } from 'node:test';

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <NavigationProvider>
      {children}
    </NavigationProvider>
  </BrowserRouter>
);

describe('useNavigation', () => {
  it('should provide navigation context', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: TestWrapper,
    });

    expect(result.current).toBeDefined();
    expect(result.current.state).toBeDefined();
    expect(result.current.navigate).toBeDefined();
    expect(result.current.goBack).toBeDefined();
    expect(result.current.setBreadcrumbs).toBeDefined();
    expect(result.current.canGoBack).toBeDefined();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useNavigation(), {
      wrapper: TestWrapper,
    });

    expect(result.current.state.currentPage).toBe('Products');
    expect(result.current.state.breadcrumbs).toEqual([
      { label: 'Products', path: '/products', isActive: true }
    ]);
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useNavigation());
    }).toThrow('useNavigation must be used within a NavigationProvider');

    consoleSpy.mockRestore();
  });
});