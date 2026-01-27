import React, { createContext, useState, useContext, useEffect } from 'react';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
  // Load initial data from localStorage or use defaults
  const loadFromStorage = (key, defaultValue) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  const [books, setBooks] = useState(() => 
    loadFromStorage('library_books', [
      {
        id: 1,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        isbn: '9780743273565',
        category: 'Fiction',
        status: 'available',
        publishedDate: '1925-04-10',
        pages: 180,
        copies: 5,
        availableCopies: 3
      },
      {
        id: 2,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780061120084',
        category: 'Fiction',
        status: 'available',
        publishedDate: '1960-07-11',
        pages: 281,
        copies: 3,
        availableCopies: 2
      },
      {
        id: 3,
        title: '1984',
        author: 'George Orwell',
        isbn: '9780451524935',
        category: 'Dystopian',
        status: 'borrowed',
        publishedDate: '1949-06-08',
        pages: 328,
        copies: 4,
        availableCopies: 1
      }
    ])
  );

  const [members, setMembers] = useState(() => 
    loadFromStorage('library_members', [
      {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1234567890',
        membershipDate: '2023-01-15',
        status: 'active',
        booksBorrowed: 2,
        maxBooksAllowed: 5
      },
      {
        id: 2,
        name: 'Emma Johnson',
        email: 'emma@example.com',
        phone: '+1234567891',
        membershipDate: '2023-02-20',
        status: 'active',
        booksBorrowed: 1,
        maxBooksAllowed: 5
      }
    ])
  );

  const [transactions, setTransactions] = useState(() => 
    loadFromStorage('library_transactions', [
      {
        id: 1,
        bookId: 3,
        bookTitle: '1984',
        memberId: 1,
        memberName: 'John Smith',
        type: 'borrow',
        date: '2024-01-15',
        dueDate: '2024-01-29',
        returnDate: null,
        status: 'active'
      },
      {
        id: 2,
        bookId: 2,
        bookTitle: 'To Kill a Mockingbird',
        memberId: 2,
        memberName: 'Emma Johnson',
        type: 'borrow',
        date: '2024-01-10',
        dueDate: '2024-01-24',
        returnDate: '2024-01-20',
        status: 'returned'
      }
    ])
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('library_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('library_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('library_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Book operations
  const addBook = (book) => {
    const newBook = {
      ...book,
      id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
      status: 'available',
      availableCopies: book.copies
    };
    setBooks([...books, newBook]);
  };

  const updateBook = (id, updatedBook) => {
    setBooks(books.map(book => book.id === id ? { ...book, ...updatedBook } : book));
  };

  const deleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  // Member operations
  const addMember = (member) => {
    const newMember = {
      ...member,
      id: members.length > 0 ? Math.max(...members.map(m => m.id)) + 1 : 1,
      status: 'active',
      booksBorrowed: 0,
      membershipDate: new Date().toISOString().split('T')[0]
    };
    setMembers([...members, newMember]);
  };

  const updateMember = (id, updatedMember) => {
    setMembers(members.map(member => member.id === id ? { ...member, ...updatedMember } : member));
  };

  const deleteMember = (id) => {
    setMembers(members.filter(member => member.id !== id));
  };

  // Transaction operations
  const borrowBook = (bookId, memberId) => {
    const book = books.find(b => b.id === bookId);
    const member = members.find(m => m.id === memberId);

    if (!book || !member) return false;
    if (book.availableCopies <= 0) return false;
    if (member.booksBorrowed >= member.maxBooksAllowed) return false;

    // Update book
    const updatedBooks = books.map(b =>
      b.id === bookId
        ? {
            ...b,
            availableCopies: b.availableCopies - 1,
            status: b.availableCopies - 1 === 0 ? 'borrowed' : 'available'
          }
        : b
    );
    setBooks(updatedBooks);

    // Update member
    const updatedMembers = members.map(m =>
      m.id === memberId
        ? { ...m, booksBorrowed: m.booksBorrowed + 1 }
        : m
    );
    setMembers(updatedMembers);

    // Add transaction
    const newTransaction = {
      id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
      bookId,
      bookTitle: book.title,
      memberId,
      memberName: member.name,
      type: 'borrow',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      returnDate: null,
      status: 'active'
    };

    setTransactions([...transactions, newTransaction]);
    return true;
  };

  const returnBook = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return false;

    // Update book
    const updatedBooks = books.map(b =>
      b.id === transaction.bookId
        ? {
            ...b,
            availableCopies: b.availableCopies + 1,
            status: b.availableCopies + 1 > 0 ? 'available' : 'borrowed'
          }
        : b
    );
    setBooks(updatedBooks);

    // Update member
    const updatedMembers = members.map(m =>
      m.id === transaction.memberId
        ? { ...m, booksBorrowed: Math.max(0, m.booksBorrowed - 1) }
        : m
    );
    setMembers(updatedMembers);

    // Update transaction
    const updatedTransactions = transactions.map(t =>
      t.id === transactionId
        ? {
            ...t,
            returnDate: new Date().toISOString().split('T')[0],
            status: 'returned'
          }
        : t
    );
    setTransactions(updatedTransactions);
    return true;
  };

  // Statistics
  const getStatistics = () => {
    const totalBooks = books.length;
    const totalMembers = members.length;
    const borrowedBooks = books.filter(b => b.status === 'borrowed').length;
    const availableBooks = books.filter(b => b.status === 'available').length;
    const activeTransactions = transactions.filter(t => t.status === 'active').length;
    const overdueTransactions = transactions.filter(t => {
      if (t.status !== 'active') return false;
      const dueDate = new Date(t.dueDate);
      const today = new Date();
      return dueDate < today;
    }).length;

    return {
      totalBooks,
      totalMembers,
      borrowedBooks,
      availableBooks,
      activeTransactions,
      overdueTransactions
    };
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        members,
        transactions,
        addBook,
        updateBook,
        deleteBook,
        addMember,
        updateMember,
        deleteMember,
        borrowBook,
        returnBook,
        getStatistics
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};