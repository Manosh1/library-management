import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import BorrowReturn from './pages/BorrowReturn';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import { LibraryProvider } from './contexts/LibraryContext';
import Registration from './pages/Registration';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('library_token');
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <AuthProvider>
      <LibraryProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Registration />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex">
                      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                        <Navbar toggleSidebar={toggleSidebar} />
                        <main className="p-6">
                          <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/books" element={<Books />} />
                            <Route path="/members" element={<Members />} />
                            <Route path="/borrow-return" element={<BorrowReturn />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/settings" element={<Settings />} />
                          </Routes>
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </LibraryProvider>
    </AuthProvider>
  );
}

export default App;