import { useNavigation as useNavigationContext } from '../contexts/NavigationContext';

/**
 * Custom hook for navigation functionality
 * Provides access to navigation state and actions
 * Requirements: 5.1, 5.2, 5.3 - client-side routing and navigation
 */
export const useNavigation = () => {
  return useNavigationContext();
};

export default useNavigation;