import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const res = await api.get('/auth/me');
    setUser(res.data.data);
    return res.data.data;
  };

  useEffect(() => {
    const fetchMe = async () => {
      try {
        await refreshUser();
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const login = async (email, password) => {
    try {
      await api.post('/auth/login', { email, password });
      await refreshUser();
      toast.success('Logged in');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (data) => {
    try {
      await api.post('/auth/register', data);
      toast.success('Account created. You can now log in.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logged out');
    } catch (err) {
      toast.error('Logout failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
