import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  BookOpen,
  CreditCard,
  Save,
  Upload,
  Globe,
  Moon,
  Sun
} from 'lucide-react';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    avatar: user?.avatar || ''
  });
  const [librarySettings, setLibrarySettings] = useState({
    libraryName: 'LibraryPro',
    maxBorrowDays: 14,
    maxBooksPerMember: 5,
    lateFeePerDay: 2,
    currency: 'USD',
    timezone: 'UTC',
    language: 'en'
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    borrowReminders: true,
    overdueAlerts: true,
    newBookAlerts: false,
    monthlyReports: true
  });
  const [theme, setTheme] = useState('light');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'library', label: 'Library Settings', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'appearance', label: 'Appearance', icon: SettingsIcon }
  ];

  const handleProfileSave = () => {
    updateProfile(profileData);
    alert('Profile updated successfully!');
  };

  const handleLibrarySettingsSave = () => {
    localStorage.setItem('library_settings', JSON.stringify(librarySettings));
    alert('Library settings saved!');
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and library preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h2>
                  
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=6b7280&color=fff`}
                          alt={profileData.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                          <Upload size={16} />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">Profile Picture</p>
                      <p className="text-sm text-gray-500">
                        Upload a new avatar. Recommended size: 400x400px. Max file size: 2MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={user?.role || 'Administrator'}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleProfileSave}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save size={20} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Library Settings */}
            {activeTab === 'library' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Library Configuration</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Library Name
                    </label>
                    <input
                      type="text"
                      value={librarySettings.libraryName}
                      onChange={(e) => setLibrarySettings({ ...librarySettings, libraryName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Borrow Days
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={librarySettings.maxBorrowDays}
                        onChange={(e) => setLibrarySettings({ ...librarySettings, maxBorrowDays: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Books per Member
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={librarySettings.maxBooksPerMember}
                        onChange={(e) => setLibrarySettings({ ...librarySettings, maxBooksPerMember: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Late Fee per Day ({librarySettings.currency})
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={librarySettings.lateFeePerDay}
                        onChange={(e) => setLibrarySettings({ ...librarySettings, lateFeePerDay: parseFloat(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={librarySettings.currency}
                        onChange={(e) => setLibrarySettings({ ...librarySettings, currency: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={librarySettings.timezone}
                        onChange={(e) => setLibrarySettings({ ...librarySettings, timezone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={librarySettings.language}
                        onChange={(e) => setLibrarySettings({ ...librarySettings, language: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleLibrarySettingsSave}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save size={20} className="mr-2" />
                    Save Library Settings
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {key === 'emailNotifications' && 'Receive email notifications about library activities'}
                          {key === 'borrowReminders' && 'Get reminders before books are due'}
                          {key === 'overdueAlerts' && 'Receive alerts when books become overdue'}
                          {key === 'newBookAlerts' && 'Get notified when new books are added'}
                          {key === 'monthlyReports' && 'Receive monthly library reports'}
                        </p>
                      </div>
                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Theme</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 border-2 rounded-lg text-center ${
                          theme === 'light'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Sun className="mx-auto mb-2 text-yellow-600" size={24} />
                        <div className="font-medium">Light</div>
                        <div className="text-sm text-gray-500">Default theme</div>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 border-2 rounded-lg text-center ${
                          theme === 'dark'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Moon className="mx-auto mb-2 text-gray-700" size={24} />
                        <div className="font-medium">Dark</div>
                        <div className="text-sm text-gray-500">Dark mode</div>
                      </button>
                      <button
                        onClick={() => setTheme('auto')}
                        className={`p-4 border-2 rounded-lg text-center ${
                          theme === 'auto'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <SettingsIcon className="mx-auto mb-2 text-gray-600" size={24} />
                        <div className="font-medium">Auto</div>
                        <div className="text-sm text-gray-500">Follow system</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Layout Density</h3>
                    <div className="flex space-x-4">
                      {['Comfortable', 'Cozy', 'Compact'].map((density) => (
                        <button
                          key={density}
                          className={`px-4 py-2 border rounded-lg ${
                            density === 'Comfortable'
                              ? 'border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {density}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Sidebar Style</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded mr-2"></div>
                          <span className="text-sm">Expanded</span>
                        </div>
                        <div className="h-20 bg-gray-100 rounded flex">
                          <div className="w-1/3 bg-blue-50 rounded-l"></div>
                          <div className="flex-1"></div>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded mr-2"></div>
                          <span className="text-sm">Compact</span>
                        </div>
                        <div className="h-20 bg-gray-100 rounded flex">
                          <div className="w-16 bg-blue-50 rounded-l"></div>
                          <div className="flex-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs would go here */}
            {!['profile', 'library', 'notifications', 'appearance'].includes(activeTab) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SettingsIcon className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {tabs.find(t => t.id === activeTab)?.label} Settings
                </h3>
                <p className="text-gray-600">This section is under development</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;