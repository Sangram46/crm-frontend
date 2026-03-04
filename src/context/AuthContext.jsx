import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/services';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          const { data } = await authAPI.getMe();
          setUser(data.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token might be expired, try refresh
          try {
            const { data } = await authAPI.refreshToken();
            localStorage.setItem('accessToken', data.data.accessToken);
            const meRes = await authAPI.getMe();
            setUser(meRes.data.data.user);
            setIsAuthenticated(true);
          } catch (refreshError) {
            // Clear everything
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      const { data } = await authAPI.signup(userData);
      const { user: newUser, accessToken } = data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);

      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  const signin = useCallback(async (credentials) => {
    try {
      const { data } = await authAPI.signin(credentials);
      const { user: loggedInUser, accessToken } = data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      setIsAuthenticated(true);

      toast.success(`Welcome back, ${loggedInUser.name}!`);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Continue logout even if API fails
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    signup,
    signin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
