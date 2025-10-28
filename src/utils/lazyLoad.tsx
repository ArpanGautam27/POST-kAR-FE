import { lazy, Suspense, type ComponentType } from 'react';
import LoadingSpinner from '@components/common/LoadingSpinner';

/**
 * Higher-order component for lazy loading with suspense
 */
export function withLazyLoading<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyLoadedComponent(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <LoadingSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

/**
 * Preload a lazy component
 */
export function preloadComponent(importFunc: () => Promise<{ default: ComponentType<any> }>) {
  return importFunc();
}