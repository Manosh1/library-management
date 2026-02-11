

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import BorrowReturn from "./pages/BorrowReturn";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

import Login from "./pages/Login";
import Registration from "./pages/Registration";

import { AuthProvider } from "./contexts/AuthContext";
import { LibraryProvider } from "./contexts/LibraryContext";

import { AdminRoute, MemberRoute } from "./components/ProtectedRoute";
import MemberLayout from "./components/Layout/MemberLayout";

import AdminLogin from "./pages/Admin/Login";
// Use
 import UserBorrowReturn from "./pages/User/BorrowReturnPage";
 import UserSettings from "./pages/User/SettingPage";
 import UserTransactions from "./pages/User/TransactionPage";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <AuthProvider>
      <LibraryProvider>
        <Router>
          <Routes>

            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Registration />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Member Routes */}
<Route
  path="/"
  element={
    <MemberRoute>
      <MemberLayout
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
    </MemberRoute>
  }
>
  <Route index element={<Dashboard />} />
  <Route path="books" element={<Books />} />
  <Route path="borrow-return" element={<UserBorrowReturn />} />
  <Route path="transaction" element={<UserTransactions />} />
  <Route path="reports" element={<Reports />} />
  <Route path="settings" element={<UserSettings />} />
</Route>

            {/* Admin Layout */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <div className="flex min-h-screen bg-gray-50">
                    <Sidebar
                      isOpen={isSidebarOpen}
                      toggleSidebar={toggleSidebar}
                    />
                    <div
                      className={`flex-1 transition-all duration-300 ${
                        isSidebarOpen ? "ml-64" : "ml-0"
                      }`}
                    >
                      <Navbar toggleSidebar={toggleSidebar} />
                      <main className="p-6">
                        <Routes>
                          <Route index element={<Dashboard />} />
                          <Route path="books" element={<Books />} />
                          <Route path="members" element={<Members />} />
                          <Route path="borrow-return" element={<BorrowReturn />} />
                          <Route path="transactions" element={<Transactions />} />
                          <Route path="reports" element={<Reports />} />
                          <Route path="settings" element={<Settings />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </AdminRoute>
              }
            />

          </Routes>
        </Router>
      </LibraryProvider>
    </AuthProvider>
  );
}

export default App;
