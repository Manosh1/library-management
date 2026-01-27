import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Users, 
  RefreshCw, 
  FileText, 
  BarChart, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/books', icon: BookOpen, label: 'Books' },
    { path: '/members', icon: Users, label: 'Members' },
    { path: '/borrow-return', icon: RefreshCw, label: 'Borrow/Return' },
    { path: '/transactions', icon: FileText, label: 'Transactions' },
    { path: '/reports', icon: BarChart, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-10 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {isOpen ? (
              <h1 className="text-xl font-bold text-blue-600">LibraryPro</h1>
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            )}
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {isOpen && <span className="ml-3 font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Need help?</strong>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Contact support: support@librarypro.com
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;