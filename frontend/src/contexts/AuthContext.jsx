import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('library_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    // Mock authentication
    const mockUser = {
      id: 1,
      name: 'Admin User',
      email: email,
      role: 'admin',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=10b981&color=fff'
    };
    
    setUser(mockUser);
    localStorage.setItem('library_user', JSON.stringify(mockUser));
    localStorage.setItem('library_token', 'mock-jwt-token');
    return { success: true, user: mockUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('library_user');
    localStorage.removeItem('library_token');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('library_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};