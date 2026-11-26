import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  // 1. Initialize cart items from localStorage (so cart persists across browser reloads)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Initialize wishlist items from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlistItems');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cartItems]);

  // Save to localStorage whenever wishlistItems changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    } catch (err) {
      console.error('Failed to save wishlist to localStorage', err);
    }
  }, [wishlistItems]);

  // Wishlist toggle
  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.filter((item) => item._id !== product._id);
      } else {
        return [
          ...prev,
          {
            _id: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            rating: product.rating,
            countInStock: product.countInStock,
            category: product.category,
          },
        ];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  // Track successful add-to-cart events for signature cable & cart pulse animations
  const [lastAddedEvent, setLastAddedEvent] = useState(null);

  // 2. Add item to cart
  const addToCart = (product, qty = 1, buttonPos = null) => {
    if (!product || product.countInStock <= 0) return;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        // If product already in cart, increment quantity up to available stock
        return prevItems.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: Math.min(product.countInStock, item.quantity + qty),
              }
            : item
        );
      } else {
        // If new product, append with initial quantity
        return [
          ...prevItems,
          {
            _id: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            category: product.category,
            quantity: Math.min(product.countInStock, qty),
          },
        ];
      }
    });

    setLastAddedEvent({ id: Date.now() + Math.random(), productId: product._id, targetX: buttonPos?.targetX ?? null, targetY: buttonPos?.targetY ?? null });
  };

  // 3. Update quantity of existing item
  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === productId) {
          return {
            ...item,
            quantity: Math.min(item.countInStock, newQty),
          };
        }
        return item;
      })
    );
  };

  // 4. Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  // 5. Clear entire cart (used after placing an order)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  // 6. Calculations
  // Total quantity of items in cart (for the Navbar badge)
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Subtotal (price of all items)
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Free shipping if order over $50, otherwise $10
  const shippingPrice = itemsPrice > 50 || itemsPrice === 0 ? 0 : 10.0;

  // 8% estimated sales tax
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));

  // Grand Total
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        lastAddedEvent,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
