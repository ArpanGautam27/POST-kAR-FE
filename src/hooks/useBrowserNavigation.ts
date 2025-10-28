import { useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNavigation } from './useNavigation';

/**
 * Custom hook for browser navigation compatibility
 * Handles browser back/forward buttons and URL changes
 * Requirements: 5.3 - browser back button compatibility
 */
export const useBrowserNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useNavigation();

  // Handle browser back button
  const handleBrowserBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to products page if no history
      navigate('/products');
    }
  }, [navigate]);

  // Handle browser forward button
  const handleBrowserForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  // Check if we can go back
  const canGoBack = useCallback(() => {
    return window.history.length > 1 || state.previousPage !== undefined;
  }, [state.previousPage]);

  // Check if we can go forward
  const canGoForward = useCallback(() => {
    // This is harder to determine reliably, but we can make a best guess
    return false; // Conservative approach
  }, []);

  // Handle popstate events (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // React Router handles the actual navigation
      // We can add any additional logic here if needed
      console.log('Browser navigation detected:', event.state);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle beforeunload for unsaved changes (if needed in future)
  useEffect(() => {
    const handleBeforeUnload = (_event: BeforeUnloadEvent) => {
      // Add logic here if we need to warn about unsaved changes
      // For now, we don't have any unsaved state to worry about
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Get current path info
  const getCurrentPath = useCallback(() => {
    return location.pathname;
  }, [location.pathname]);

  // Get current search params
  const getCurrentSearch = useCallback(() => {
    return location.search;
  }, [location.search]);

  // Get current hash
  const getCurrentHash = useCallback(() => {
    return location.hash;
  }, [location.hash]);

  // Navigate with state
  const navigateWithState = useCallback((path: string, state?: any) => {
    navigate(path, { state });
  }, [navigate]);

  // Replace current history entry
  const replaceCurrentEntry = useCallback((path: string, state?: any) => {
    navigate(path, { replace: true, state });
  }, [navigate]);

  return {
    currentPath: location.pathname,
    currentSearch: location.search,
    currentHash: location.hash,
    canGoBack: canGoBack(),
    canGoForward: canGoForward(),
    handleBrowserBack,
    handleBrowserForward,
    getCurrentPath,
    getCurrentSearch,
    getCurrentHash,
    navigateWithState,
    replaceCurrentEntry
  };
};

export default useBrowserNavigation;