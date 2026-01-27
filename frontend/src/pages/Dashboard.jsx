import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  BarChart as ChartBar
} from 'lucide-react';
import RecentTransactions from "../pages/RecentTransactions"
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const { getStatistics, books, transactions } = useLibrary();
  const stats = getStatistics();

  // Get recent books
  const recentBooks = [...books]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  // Get overdue books
  const today = new Date();
  const overdueTransactions = transactions.filter(t => {
    if (t.status !== 'active') return false;
    const dueDate = new Date(t.dueDate);
    return dueDate < today;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to Library Management System</p>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Books"
          value={stats.totalBooks}
          icon={BookOpen}
          trend="+12%"
          color="blue"
        />
        <StatsCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          trend="+8%"
          color="green"
        />
        <StatsCard
          title="Borrowed Books"
          value={stats.borrowedBooks}
          icon={TrendingUp}
          trend="-3%"
          color="orange"
        />
        <StatsCard
          title="Overdue Books"
          value={stats.overdueTransactions}
          icon={AlertCircle}
          trend="+2"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recently Added Books</h2>
            <Calendar size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentBooks.map((book) => (
              <div key={book.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{book.title}</h3>
                  <p className="text-sm text-gray-500">{book.author} • {book.category}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  book.status === 'available' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.status}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All Books →
          </button>
        </div>

        {/* Overdue Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Overdue Books</h2>
            <AlertCircle size={20} className="text-red-400" />
          </div>
          {overdueTransactions.length > 0 ? (
            <div className="space-y-4">
              {overdueTransactions.map((transaction) => {
                const dueDate = new Date(transaction.dueDate);
                const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={transaction.id} className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{transaction.bookTitle}</h3>
                        <p className="text-sm text-gray-600">Borrowed by: {transaction.memberName}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      Due: {dueDate.toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <ChartBar size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No overdue books. Great job!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </button>
        </div>
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;