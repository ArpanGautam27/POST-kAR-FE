import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';
import { cartService, type CartItemData } from '../services/CartService';

interface CartItem {
  product: Product;
  quantity: number;
  productType?: string;  // Variant support
  size?: string;          // Variant support
  unitPrice: number;      // Price from backend
  totalPrice: number;     // Total for this item from backend
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

/**
 * Convert backend CartItemData to frontend CartItem format
 */
const convertToCartItem = (backendItem: CartItemData): CartItem => {
  const product: Product = {
    id: backendItem.markerId,
    name: backendItem.markerName,
    description: '', // Backend doesn't provide this
    thumbnail_url: backendItem.thumbnailUrl,
    image_url: backendItem.thumbnailUrl, // Use thumbnail as image URL
    image_id: '', // Backend doesn't provide this
    video_url: '', // Backend doesn't provide this
    metadata: {},
  };

  return {
    product,
    quantity: backendItem.quantity,
    productType: backendItem.productType,
    size: backendItem.size,
    unitPrice: backendItem.unitPrice,      // ✅ Use backend price
    totalPrice: backendItem.totalPrice,    // ✅ Use backend total
  };
};

/**
 * CartProvider component manages shopping cart state
 * Provides cart functionality throughout the application
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cart from backend on mount
  const fetchCartFromBackend = async () => {
    try {
      const token = localStorage.getItem('postkar-auth-token');
      if (!token) {
        // No authentication, use localStorage fallback
        const savedCart = localStorage.getItem('postkar-cart');
        setItems(savedCart ? JSON.parse(savedCart) : []);
        setIsLoading(false);
        return;
      }

      console.log('🛒 Fetching cart from backend...');
      const response = await cartService.getCart();

      if (response.success && response.data?.items) {
        console.log('✅ Cart fetched:', response.data.items);
        const cartItems = response.data.items.map(convertToCartItem);
        setItems(cartItems);
        // Also save to localStorage for offline access
        localStorage.setItem('postkar-cart', JSON.stringify(cartItems));
      } else {
        console.log('⚠️ Empty cart or no data');
        setItems([]);
      }
    } catch (error) {
      console.error('❌ Error fetching cart:', error);
      // Fallback to localStorage on error
      const savedCart = localStorage.getItem('postkar-cart');
      setItems(savedCart ? JSON.parse(savedCart) : []);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart on mount
  useEffect(() => {
    fetchCartFromBackend();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && typeof window !== 'undefined') {
      localStorage.setItem('postkar-cart', JSON.stringify(items));
    }
  }, [items, isLoading]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // ✅ Use actual backend prices instead of hardcoded $99.99
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const addToCart = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.product.id === product.id);

      if (existingItem) {
        // Increase quantity if item already exists
        // Note: In practice, backend API should be called instead
        const newQuantity = existingItem.quantity + 1;
        return currentItems.map(item =>
          item.product.id === product.id
            ? {
              ...item,
              quantity: newQuantity,
              totalPrice: existingItem.unitPrice * newQuantity
            }
            : item
        );
      } else {
        // Add new item with quantity 1
        // Default price (will be overridden by backend on refresh)
        return [...currentItems, {
          product,
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter(item => item.product.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map(item =>
        item.product.id === productId
          ? {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity  // ✅ Recalculate total
          }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (productId: string): boolean => {
    return items.some(item => item.product.id === productId);
  };

  const getCartItem = (productId: string): CartItem | undefined => {
    return items.find(item => item.product.id === productId);
  };

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
    refreshCart: fetchCartFromBackend,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Custom hook to use cart context
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
