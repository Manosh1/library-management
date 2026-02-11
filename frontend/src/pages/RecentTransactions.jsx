import React from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

const RecentTransactions = () => {
  const { transactions } = useLibrary();
  
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

    console.log("Recent Transactions:", recentTransactions);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Book</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Member</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Type</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {recentTransactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-4 py-4">
                <div className="font-medium text-gray-900">{transaction.book_title}</div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-600">{transaction.member_name}</div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center">
                  {transaction.type === 'borrow' ? (
                    <ArrowUpRight className="text-red-500 mr-2" size={16} />
                  ) : (
                    <ArrowDownRight className="text-green-500 mr-2" size={16} />
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    transaction.type === 'borrow'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {transaction.type}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-2" size={14} />
                  {transaction.return_date ? new Date(transaction.return_date).toLocaleDateString() : new Date(transaction.borrow_date).toLocaleDateString()}
                </div>
              </td>
              <td className="px-4 py-4">
                <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                  transaction.status === 'active'
                    ? 'bg-blue-100 text-blue-800'
                    : transaction.status === 'returned'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;