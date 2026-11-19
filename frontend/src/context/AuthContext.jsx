import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Read initial user state from localStorage (persists login across page reloads)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('userInfo');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear errors when navigating or changing views
  const clearError = () => setError(null);

  // 1. User Login Action
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/users/login', { email, password });
      const userData = response.data;

      // Save to React State & LocalStorage
      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // 2. User Registration Action
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/users/register', { name, email, password });
      const userData = response.data;

      // Save to React State & LocalStorage
      setUser(userData);
      localStorage.setItem('userInfo', JSON.stringify(userData));

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // 3. User Logout Action
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to consume AuthContext cleanly in any component
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
