import React, { useState } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { 
  Search, 
  BookOpen, 
  User, 
  ArrowRight, 
  RefreshCw,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const BorrowReturn = () => {
  const { books, members, borrowBook, returnBook, transactions } = useLibrary();
  const [activeTab, setActiveTab] = useState('borrow');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchBook, setSearchBook] = useState('');
  const [searchMember, setSearchMember] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Filter available books for borrowing
const availableBooks = books.filter(
  book => book.available_copies > 0 && book.status === "active"
);

  // Filter members who can borrow more books
const eligibleMembers = members.filter(member => member.status === 1);



 
console.log("Transactions Books:", transactions);
  // Get active borrowings for return
 const activeBorrowings = transactions.filter(
  (t) => t.status === 'borrowed' && !t.return_date
);


 const handleBorrow = async () => {
  if (!selectedBook || !selectedMember) {
    setMessage({ type: 'error', text: 'Please select both a book and a member' });
    return;
  }

  try {
     const response = await borrowBook(selectedBook.id, selectedMember.id);
console.log("Borrow  frontend Response:", response);
    setMessage({
      type: 'success',
      text: `Successfully borrowed "${selectedBook.title}" for ${selectedMember.full_name}`
    });

    setSelectedBook(null);
    setSelectedMember(null);
    setSearchBook('');
    setSearchMember('');

  } catch (error) {
    setMessage({
      type: 'error',
      text: error.response?.data?.message || 'Borrow failed'
    });
  }
};


  const handleReturn = async (transactionId) => {
  try {
    await returnBook(transactionId);
    setMessage({ type: 'success', text: 'Book returned successfully' });
  } catch (error) {
    setMessage({
      type: 'error',
      text: error.response?.data?.message || 'Return failed'
    });
  }
};



  const filteredBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(searchBook.toLowerCase()) ||
    book.author.toLowerCase().includes(searchBook.toLowerCase())
  );

  const filteredMembers = eligibleMembers.filter(member =>
    member.full_name.toLowerCase().includes(searchMember.toLowerCase()) ||
    member.email.toLowerCase().includes(searchMember.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Borrow & Return</h1>
        <p className="text-gray-600">Manage book borrowing and returning operations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('borrow')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'borrow'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <ArrowRight className="mr-2" size={18} />
              Borrow Books
            </div>
          </button>
          <button
            onClick={() => setActiveTab('return')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'return'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <RefreshCw className="mr-2" size={18} />
              Return Books
            </div>
          </button>
        </nav>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? 
              <CheckCircle className="mr-2" size={20} /> : 
              <AlertCircle className="mr-2" size={20} />
            }
            {message.text}
          </div>
        </div>
      )}

      {/* Borrow Tab Content */}
      {activeTab === 'borrow' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Book Selection */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Book</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search available books..."
                  value={searchBook}
                  onChange={(e) => setSearchBook(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredBooks.map((book) => (
                  <div
                    key={book.id}
                    onClick={() => setSelectedBook(book)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedBook?.id === book.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <BookOpen className="text-blue-600" size={18} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{book.title}</h3>
                        <p className="text-sm text-gray-600">{book.author}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <span className="text-gray-500 mr-4">Category: {book.category}</span>
                          <span className="text-gray-500">Available: {book.availableCopies}</span>
                        </div>
                      </div>
                      {selectedBook?.id === book.id && (
                        <CheckCircle className="text-blue-600 ml-2" size={20} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Selection */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Member</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search eligible members..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedMember?.id === member.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="text-blue-600" size={18} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{member.full_name}</h3>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <div className="flex items-center mt-2 text-sm">
                          <span className="text-gray-500 mr-4">Books: {member.booksBorrowed}/{member.maxBooksAllowed}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            member.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      </div>
                      {selectedMember?.id === member.id && (
                        <CheckCircle className="text-blue-600 ml-2" size={20} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Summary */}
          {(selectedBook || selectedMember) && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Transaction Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedBook && (
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Selected Book</div>
                    <div className="font-medium">{selectedBook.title}</div>
                    <div className="text-sm text-gray-600">by {selectedBook.author}</div>
                  </div>
                )}
                {selectedMember && (
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Selected Member</div>
                    <div className="font-medium">{selectedMember.full_name}</div>
                    <div className="text-sm text-gray-600">{selectedMember.email}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={handleBorrow}
              disabled={!selectedBook || !selectedMember}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Complete Borrow Transaction
            </button>
          </div>
        </div>
      )}

      {/* Return Tab Content */}
      {activeTab === 'return' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Active Borrowings</h2>
          
          {activeBorrowings.length > 0 ? (
            <div className="space-y-4">
              {activeBorrowings.map((transaction) => {
                const dueDate = new Date(transaction.due_date);

                const today = new Date();
                const isOverdue = dueDate < today;
                const daysOverdue = isOverdue 
                  ? Math.floor((today - dueDate) / (1000 * 60 * 60 * 24))
                  : 0;

                return (
                  <div key={transaction.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <BookOpen className="text-blue-600" size={18} />
                          </div>
                          <div>
                   <h3 className="font-medium text-gray-900">
  {transaction.book_title}
</h3>
<p className="text-sm text-gray-600">
  Borrowed by: {transaction.member_name}
</p>

                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                           <span className="font-medium">
  {new Date(transaction.borrow_date).toLocaleDateString()}
</span>

                          </div>
                          <div>
                            <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
  {new Date(transaction.due_date).toLocaleDateString()}
  {isOverdue && ` (${daysOverdue} days overdue)`}
</span>

                          </div>
                          <div>
                            <span className="text-gray-500">Transaction ID:</span>{' '}
                            <span className="font-mono font-medium">#{transaction.id}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 md:ml-4">
                        <button
                          onClick={() => handleReturn(transaction.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Mark as Returned
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <RefreshCw className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No active borrowings</h3>
              <p className="text-gray-600">There are currently no books borrowed from the library.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowReturn;