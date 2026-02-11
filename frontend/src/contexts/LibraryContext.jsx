import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const LibraryContext = createContext();
export const useLibrary = () => useContext(LibraryContext);

const API = "http://localhost:3000/api";

export const LibraryProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("library_token");

  const api = axios.create({
    baseURL: API,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 📚 BOOKS
  const fetchBooks = async () => {
    const res = await api.get("/books");
    setBooks(res.data);
  };

  const addBook = async (data) => {
    await api.post("/books", {
      title: data.title,
      author: data.author,
      isbn: data.isbn,
      category: data.category,
      published_date: data.publishedDate,
      pages: data.pages,
      total_copies: data.copies,
      description: data.description,
    });
    fetchBooks();
  };

  const updateBook = async (id, data) => {
    await api.put(`/books/${id}`, data);
    fetchBooks();
  };

  const deleteBook = async (id) => {
    await api.delete(`/books/${id}`);
    fetchBooks();
  };

  // 🔁 TRANSACTIONS (borrow / return)
const borrowBook = async (bookId, memberId) => {
  try {
    const response = await api.post("/admin/transactions/borrow", {
      bookId,
      memberId
    });

    console.log("Borrow Response:", response.data);

    return response.data;

  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Borrow failed"
    };
  }
};


const returnBook = async (transactionId) => {
  try {
    const response = await api.post("/admin/transactions/return", {
      transactionId
    });

    await fetchBooks();
    await fetchTransactions();

    return {
      success: true,
      message: response.data.message
    };

  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Return failed"
    };
  }
};



  const fetchTransactions = async () => {
    const res = await api.get("/admin/all-transactions");
    console.log("Fetch Transactions", res);
    setTransactions(res.data);
  };

 

  // 👤 MEMBERS
  const fetchMembers = async () => {
    const res = await api.get("/admin/users");
   console.log("Fetch Members", res.data)
    setMembers(res.data);
  };

  const deleteMemberById = async (id) => {
    await api.delete(`/admin/users/${id}`);
    fetchMembers();
  };

  const getStatistics = () => {
  return {
    totalBooks: books.length,
    totalMembers: members.length,
    totalTransactions: transactions.length,
    borrowedBooks: transactions.filter(t => !t.return_date).length,
  };
};


  useEffect(() => {
    fetchBooks();
    fetchMembers();
    fetchTransactions();
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        books,
        members,
        transactions,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
        getStatistics,
        fetchMembers,
        deleteMemberById
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
