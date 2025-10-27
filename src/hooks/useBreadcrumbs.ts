import { useCallback } from 'react';
import { useNavigation } from './useNavigation';
import type { BreadcrumbItem } from '../types';

/**
 * Custom hook for breadcrumb navigation functionality
 * Provides utilities for managing breadcrumb navigation
 * Requirements: 5.2, 2.5 - breadcrumb navigation
 */
export const useBreadcrumbs = () => {
  const { state, setBreadcrumbs, addBreadcrumb, clearBreadcrumbs, navigate } = useNavigation();

  // Create breadcrumbs for product detail page
  const createProductDetailBreadcrumbs = useCallback((productName?: string) => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Products', path: '/products', isActive: false }
    ];

    if (productName) {
      breadcrumbs.push({
        label: productName,
        path: window.location.pathname,
        isActive: true
      });
    } else {
      breadcrumbs.push({
        label: 'Product Detail',
        path: window.location.pathname,
        isActive: true
      });
    }

    return breadcrumbs;
  }, []);

  // Create breadcrumbs for scanner page
  const createScannerBreadcrumbs = useCallback((fromProduct?: string) => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Products', path: '/products', isActive: false }
    ];

    if (fromProduct) {
      breadcrumbs.push({
        label: 'Product Detail',
        path: `/product/${fromProduct}`,
        isActive: false
      });
    }

    breadcrumbs.push({
      label: 'Scanner',
      path: '/scanner/scan.html',
      isActive: true
    });

    return breadcrumbs;
  }, []);

  // Navigate to breadcrumb item
  const navigateToBreadcrumb = useCallback((breadcrumb: BreadcrumbItem) => {
    if (!breadcrumb.isActive) {
      navigate(breadcrumb.path);
    }
  }, [navigate]);

  // Update breadcrumbs for current page
  const updateBreadcrumbsForPage = useCallback((pagePath: string, productName?: string, productId?: string) => {
    let breadcrumbs: BreadcrumbItem[] = [];

    if (pagePath === '/' || pagePath === '/products') {
      breadcrumbs = [
        { label: 'Products', path: '/products', isActive: true }
      ];
    } else if (pagePath.startsWith('/product/')) {
      breadcrumbs = createProductDetailBreadcrumbs(productName);
    } else if (pagePath === '/scanner/scan.html') {
      breadcrumbs = createScannerBreadcrumbs(productId);
    } else {
      // Default breadcrumbs for unknown pages
      breadcrumbs = [
        { label: 'Products', path: '/products', isActive: false },
        { label: 'Page', path: pagePath, isActive: true }
      ];
    }

    setBreadcrumbs(breadcrumbs);
  }, [createProductDetailBreadcrumbs, createScannerBreadcrumbs, setBreadcrumbs]);

  return {
    breadcrumbs: state.breadcrumbs,
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs,
    createProductDetailBreadcrumbs,
    createScannerBreadcrumbs,
    navigateToBreadcrumb,
    updateBreadcrumbsForPage
  };
};

export default useBreadcrumbs;