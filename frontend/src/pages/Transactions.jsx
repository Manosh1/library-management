import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const Transactions = () => {
  const { transactions } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toString().includes(searchTerm);
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    
    const matchesDate = (!dateRange.start || transaction.date >= dateRange.start) &&
                       (!dateRange.end || transaction.date <= dateRange.end);

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const statusConfig = {
    active: { color: 'bg-blue-100 text-blue-800', icon: Clock },
    returned: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    overdue: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
  };

  const typeConfig = {
    borrow: { color: 'bg-purple-100 text-purple-800', label: 'Borrow' },
    return: { color: 'bg-yellow-100 text-yellow-800', label: 'Return' }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Book Title', 'Member Name', 'Type', 'Date', 'Due Date', 'Return Date', 'Status'];
    const data = filteredTransactions.map(t => [
      t.id,
      t.bookTitle,
      t.memberName,
      t.type,
      t.date,
      t.dueDate,
      t.returnDate || 'N/A',
      t.status
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions History</h1>
          <p className="text-gray-600">View and manage all library transactions</p>
        </div>
        <button
          onClick={exportToCSV}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={20} className="mr-2" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="borrow">Borrow</option>
              <option value="return">Return</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setFilterStatus('all');
              setDateRange({ start: '', end: '' });
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const StatusIcon = statusConfig[transaction.status]?.icon || Clock;
                const isOverdue = transaction.status === 'active' && 
                  new Date(transaction.dueDate) < new Date();
                const displayStatus = isOverdue ? 'overdue' : transaction.status;
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{transaction.bookTitle}</div>
                        <div className="text-sm text-gray-500">ID: #{transaction.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{transaction.memberName}</div>
                        <div className="text-gray-500">Member ID: {transaction.memberId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          <span className="text-gray-600">Borrowed: {transaction.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          <span className={`${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                            Due: {transaction.dueDate}
                          </span>
                        </div>
                        {transaction.returnDate && (
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2 text-gray-400" />
                            <span className="text-green-600">Returned: {transaction.returnDate}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${typeConfig[transaction.type].color}`}>
                          {typeConfig[transaction.type].label}
                        </span>
                        <div className="flex items-center">
                          <StatusIcon size={14} className="mr-1" />
                          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                            statusConfig[displayStatus]?.color || 'bg-gray-100 text-gray-800'
                          }`}>
                            {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;