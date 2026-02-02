import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('library_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

const login = async (email, password) => {


  try {
    const res = await axios.post(
      "http://localhost:3000/api/auth/login",
      { email, password }
    );


    const { user, token } = res.data;
console.log("User",user)
    setUser(user);
    localStorage.setItem("library_user", JSON.stringify(user));
    localStorage.setItem("library_token", token);

    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Login failed. Try again.",
    };
  }
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