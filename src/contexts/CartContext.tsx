import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItem: (productId: string) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

/**
 * CartProvider component manages shopping cart state
 * Provides cart functionality throughout the application
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage on initialization
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('postkar-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('postkar-cart', JSON.stringify(items));
    }
  }, [items]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // For now, using a placeholder price since products don't have prices in the current schema
  // You can update this when price is added to the Product type
  const totalPrice = items.reduce((sum, item) => sum + (item.quantity * 99.99), 0);

  const addToCart = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Increase quantity if item already exists
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...currentItems, { product, quantity: 1 }];
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
          ? { ...item, quantity }
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
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
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
