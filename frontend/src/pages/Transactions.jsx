import React, { useState, useMemo } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import {
  Search,
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

  // ✅ Normalize backend data
  const normalizedTransactions = useMemo(() => {
    return transactions.map(t => {
      const isReturned = !!t.return_date;
      const isOverdue =
        !isReturned && new Date(t.due_date) < new Date();

      return {
        id: t.id,
        bookTitle: t.book_title,
        memberName: t.member_name,
        memberId: t.user_id,
        date: t.borrow_date,
        dueDate: t.due_date,
        returnDate: t.return_date,
        type: isReturned ? 'return' : 'borrow',
        status: isReturned
          ? 'returned'
          : isOverdue
          ? 'overdue'
          : 'active'
      };
    });
  }, [transactions]);

  // ✅ Filtering
  const filteredTransactions = normalizedTransactions.filter(transaction => {
    const matchesSearch =
      transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toString().includes(searchTerm);

    const matchesType =
      filterType === 'all' || transaction.type === filterType;

    const matchesStatus =
      filterStatus === 'all' || transaction.status === filterStatus;

    const transactionDate = new Date(transaction.date)
      .toISOString()
      .split('T')[0];

    const matchesDate =
      (!dateRange.start || transactionDate >= dateRange.start) &&
      (!dateRange.end || transactionDate <= dateRange.end);

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

  // ✅ CSV Export
  const exportToCSV = () => {
    const headers = [
      'ID',
      'Book Title',
      'Member Name',
      'Type',
      'Borrow Date',
      'Due Date',
      'Return Date',
      'Status'
    ];

    const data = filteredTransactions.map(t => [
      t.id,
      t.bookTitle,
      t.memberName,
      t.type,
      new Date(t.date).toLocaleDateString(),
      new Date(t.dueDate).toLocaleDateString(),
      t.returnDate
        ? new Date(t.returnDate).toLocaleDateString()
        : 'N/A',
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
    a.download = `transactions_${new Date()
      .toISOString()
      .split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transactions History
          </h1>
          <p className="text-gray-600">
            View and manage all library transactions
          </p>
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
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="borrow">Borrow</option>
            <option value="return">Return</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
          </select>

          <div className="flex space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={e =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={e =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Book
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Dates
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type & Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.map(transaction => {
              const StatusIcon =
                statusConfig[transaction.status]?.icon || Clock;

              return (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {transaction.bookTitle}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: #{transaction.id}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-gray-900">
                      {transaction.memberName}
                    </div>
                    <div className="text-gray-500">
                      Member ID: {transaction.memberId}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm space-y-1">
                    <div>
                      Borrowed:{' '}
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                    <div
                      className={
                        transaction.status === 'overdue'
                          ? 'text-red-600'
                          : ''
                      }
                    >
                      Due:{' '}
                      {new Date(transaction.dueDate).toLocaleDateString()}
                    </div>
                    {transaction.returnDate && (
                      <div className="text-green-600">
                        Returned:{' '}
                        {new Date(
                          transaction.returnDate
                        ).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 space-y-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        typeConfig[transaction.type].color
                      }`}
                    >
                      {typeConfig[transaction.type].label}
                    </span>

                    <div className="flex items-center">
                      <StatusIcon size={14} className="mr-1" />
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          statusConfig[transaction.status]?.color
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={24} />
            <h3 className="text-lg font-medium text-gray-900">
              No transactions found
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
