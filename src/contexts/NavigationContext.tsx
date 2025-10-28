import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { NavigationState, BreadcrumbItem } from '../types';

// Navigation action types
type NavigationAction =
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'SET_PREVIOUS_PAGE'; payload: string }
  | { type: 'SET_BREADCRUMBS'; payload: BreadcrumbItem[] }
  | { type: 'ADD_BREADCRUMB'; payload: BreadcrumbItem }
  | { type: 'CLEAR_BREADCRUMBS' }
  | { type: 'UPDATE_NAVIGATION'; payload: Partial<NavigationState> };

// Navigation context type
interface NavigationContextType {
  state: NavigationState;
  navigate: (path: string) => void;
  goBack: () => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  addBreadcrumb: (breadcrumb: BreadcrumbItem) => void;
  clearBreadcrumbs: () => void;
  canGoBack: boolean;
}

// Initial state
const initialState: NavigationState = {
  currentPage: '',
  previousPage: undefined,
  breadcrumbs: []
};

// Navigation reducer
function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        previousPage: state.currentPage || undefined,
        currentPage: action.payload
      };
    case 'SET_PREVIOUS_PAGE':
      return {
        ...state,
        previousPage: action.payload
      };
    case 'SET_BREADCRUMBS':
      return {
        ...state,
        breadcrumbs: action.payload
      };
    case 'ADD_BREADCRUMB':
      return {
        ...state,
        breadcrumbs: [...state.breadcrumbs, action.payload]
      };
    case 'CLEAR_BREADCRUMBS':
      return {
        ...state,
        breadcrumbs: []
      };
    case 'UPDATE_NAVIGATION':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

// Create context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Navigation provider component
interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState);
  const location = useLocation();
  const navigate = useNavigate();

  // Update current page based on location changes
  useEffect(() => {
    const path = location.pathname;
    let pageName = '';
    let breadcrumbs: BreadcrumbItem[] = [];

    // Determine page name and breadcrumbs based on current path
    if (path === '/' || path === '/products') {
      pageName = 'Products';
      breadcrumbs = [
        { label: 'Products', path: '/products', isActive: true }
      ];
    } else if (path.startsWith('/product/')) {
      pageName = 'Product Detail';
      breadcrumbs = [
        { label: 'Products', path: '/products', isActive: false },
        { label: 'Product Detail', path: path, isActive: true }
      ];
    } else if (path === '/scanner/scan.html' || path === '/scanner/scan_mind.html') {
      pageName = 'Scanner';
      breadcrumbs = [
        { label: 'Products', path: '/products', isActive: false },
        { label: 'Scanner', path: path, isActive: true }
      ];
    } else {
      pageName = 'Page Not Found';
      breadcrumbs = [
        { label: 'Products', path: '/products', isActive: false },
        { label: 'Page Not Found', path: path, isActive: true }
      ];
    }

    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageName });
    dispatch({ type: 'SET_BREADCRUMBS', payload: breadcrumbs });
  }, [location.pathname]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      // Browser back button was used - React Router will handle the navigation
      // We just need to update our state accordingly
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation functions
  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to products page if no history
      navigate('/products');
    }
  };

  const setBreadcrumbs = (breadcrumbs: BreadcrumbItem[]) => {
    dispatch({ type: 'SET_BREADCRUMBS', payload: breadcrumbs });
  };

  const addBreadcrumb = (breadcrumb: BreadcrumbItem) => {
    dispatch({ type: 'ADD_BREADCRUMB', payload: breadcrumb });
  };

  const clearBreadcrumbs = () => {
    dispatch({ type: 'CLEAR_BREADCRUMBS' });
  };

  const canGoBack = state.previousPage !== undefined || window.history.length > 1;

  const contextValue: NavigationContextType = {
    state,
    navigate: handleNavigate,
    goBack: handleGoBack,
    setBreadcrumbs,
    addBreadcrumb,
    clearBreadcrumbs,
    canGoBack
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook to use navigation context
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export default NavigationContext;