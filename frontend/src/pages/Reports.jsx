import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download,
  Calendar,
  BookOpen,
  Users,
  DollarSign
} from 'lucide-react';

const Reports = () => {
  const { books, members, transactions, getStatistics } = useLibrary();
  const [reportType, setReportType] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');

  const stats = getStatistics();

  // Calculate monthly borrowings
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    borrowings: [45, 52, 48, 61, 55, 58, 62, 70, 65, 58, 52, 60],
    returns: [42, 48, 45, 58, 52, 55, 58, 65, 60, 54, 48, 55]
  };

  // Calculate category distribution
  const categoryDistribution = books.reduce((acc, book) => {
    acc[book.category] = (acc[book.category] || 0) + 1;
    return acc;
  }, {});

  const categoryData = {
    labels: Object.keys(categoryDistribution),
    data: Object.values(categoryDistribution),
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
  };

  // Calculate top borrowed books
  const bookBorrowCount = transactions.reduce((acc, t) => {
    if (t.type === 'borrow') {
      acc[t.bookTitle] = (acc[t.bookTitle] || 0) + 1;
    }
    return acc;
  }, {});

  const topBooks = Object.entries(bookBorrowCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([title, count]) => ({ title, count }));

  // Calculate revenue (simulated)
  const calculateRevenue = () => {
    const lateReturns = transactions.filter(t => {
      if (!t.returnDate) return false;
      const returnDate = new Date(t.returnDate);
      const dueDate = new Date(t.dueDate);
      return returnDate > dueDate;
    });

    const lateFees = lateReturns.length * 2; // $2 per day late
    const membershipFees = members.length * 25; // $25 per year per member
    const lostBookFees = 0; // Could add logic for lost books

    return {
      lateFees,
      membershipFees,
      lostBookFees,
      total: lateFees + membershipFees + lostBookFees
    };
  };

  const revenue = calculateRevenue();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Library performance insights and statistics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={20} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'books', label: 'Books', icon: BookOpen },
            { id: 'members', label: 'Members', icon: Users },
            { id: 'financial', label: 'Financial', icon: DollarSign },
            { id: 'trends', label: 'Trends', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                reportType === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <tab.icon className="mr-2" size={18} />
                {tab.label}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Report */}
      {reportType === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalBooks}</p>
                  <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalMembers}</p>
                  <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="text-green-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Borrowings</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeTransactions}</p>
                  <p className="text-xs text-red-600 mt-1">-3% from last month</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-orange-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">${revenue.total}</p>
                  <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Borrowings Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Monthly Borrowings</h3>
                <Calendar className="text-gray-400" size={20} />
              </div>
              <div className="h-64">
                {/* Simple bar chart using divs */}
                <div className="flex items-end justify-between h-48 mt-4">
                  {monthlyData.borrowings.map((value, index) => (
                    <div key={index} className="flex flex-col items-center flex-1 mx-1">
                      <div className="text-xs text-gray-500 mb-1">{monthlyData.labels[index]}</div>
                      <div className="flex items-end space-x-1 w-full">
                        <div 
                          className="w-full bg-blue-500 rounded-t"
                          style={{ height: `${(value / 70) * 100}%` }}
                          title={`Borrowings: ${value}`}
                        ></div>
                        <div 
                          className="w-full bg-green-500 rounded-t"
                          style={{ height: `${(monthlyData.returns[index] / 70) * 100}%` }}
                          title={`Returns: ${monthlyData.returns[index]}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Borrowings</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                    <span className="text-sm text-gray-600">Returns</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Books by Category</h3>
                <PieChart className="text-gray-400" size={20} />
              </div>
              <div className="h-64">
                {/* Simple pie chart using grid */}
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      {/* Simplified pie chart representation */}
                      <div className="absolute inset-0 rounded-full border-8 border-blue-500"></div>
                      <div className="absolute inset-0 rounded-full border-8 border-green-500" 
                        style={{ clipPath: 'inset(0 0 0 50%)' }}></div>
                      <div className="absolute inset-0 rounded-full border-8 border-yellow-500" 
                        style={{ clipPath: 'inset(0 50% 0 0)' }}></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {categoryData.labels.slice(0, 6).map((label, index) => (
                      <div key={label} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded mr-2"
                          style={{ backgroundColor: categoryData.colors[index] }}
                        ></div>
                        <span className="text-sm text-gray-900">{label}</span>
                        <span className="ml-auto text-sm font-medium">
                          {categoryData.data[index]} ({Math.round((categoryData.data[index] / stats.totalBooks) * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Books Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Most Borrowed Books</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rank</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Book Title</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Author</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Times Borrowed</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topBooks.map((book, index) => {
                    const bookInfo = books.find(b => b.title === book.title) || {};
                    return (
                      <tr key={book.title} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            #{index + 1}
                          </div>
                        </td>
                        <td className="px-4 py-4 font-medium text-gray-900">{book.title}</td>
                        <td className="px-4 py-4 text-gray-600">{bookInfo.author || 'Unknown'}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(book.count / Math.max(...topBooks.map(b => b.count))) * 100}%` }}
                              ></div>
                            </div>
                            <span className="font-medium">{book.count}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            bookInfo.availableCopies > 0 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {bookInfo.availableCopies > 0 ? 'Available' : 'Unavailable'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Books Report */}
      {reportType === 'books' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Book Status Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Available', value: stats.availableBooks, color: 'bg-green-500' },
                { label: 'Borrowed', value: stats.borrowedBooks, color: 'bg-blue-500' },
                { label: 'Reserved', value: 0, color: 'bg-yellow-500' },
                { label: 'Damaged/Lost', value: 0, color: 'bg-red-500' }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-2`}></div>
                  <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.round((item.value / stats.totalBooks) * 100)}% of total
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Categories</h3>
            <div className="space-y-4">
              {Object.entries(categoryDistribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-900">{category}</span>
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(categoryDistribution))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Financial Report */}
      {reportType === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'Membership Fees', value: revenue.membershipFees, color: 'bg-blue-500' },
                { label: 'Late Fees', value: revenue.lateFees, color: 'bg-red-500' },
                { label: 'Lost Book Fees', value: revenue.lostBookFees, color: 'bg-yellow-500' },
                { label: 'Other Income', value: 0, color: 'bg-green-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 ${item.color} rounded mr-3`}></div>
                    <span className="text-gray-900">{item.label}</span>
                  </div>
                  <span className="font-medium">${item.value}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Revenue</span>
                  <span className="text-lg font-bold text-gray-900">${revenue.total}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trend</h3>
            <div className="h-64">
              {/* Simple revenue trend chart */}
              <div className="flex items-end justify-between h-48 mt-4">
                {[1200, 1350, 1100, 1450, 1600, 1550, 1700, 1650, 1800, 1750, 1900, 1850].map((value, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 mx-1">
                    <div className="text-xs text-gray-500 mb-1">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}</div>
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                      style={{ height: `${(value / 2000) * 100}%` }}
                      title={`$${value}`}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 text-sm text-gray-600">
                Monthly Revenue for Past Year
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;