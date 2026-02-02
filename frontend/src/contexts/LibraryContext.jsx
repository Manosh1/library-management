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
    await api.post("/transactions/borrow", { bookId, memberId });
    fetchBooks();
    fetchTransactions();
  };

  const returnBook = async (transactionId) => {
    await api.post("/transactions/return", { transactionId });
    fetchBooks();
    fetchTransactions();
  };

  const fetchTransactions = async () => {
    const res = await api.get("/transactions");
    setTransactions(res.data);
  };

  // 👤 MEMBERS
  const fetchMembers = async () => {
    const res = await api.get("/admin/users");
   
    setMembers(res.data);
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
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
