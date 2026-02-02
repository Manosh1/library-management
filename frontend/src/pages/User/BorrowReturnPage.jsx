import React, { useState } from "react";

const UserBorrowReturn = () => {
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");
  const [action, setAction] = useState("borrow");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      bookId,
      memberId,
      action,
    });

    alert(`Book ${action}ed successfully`);
    setBookId("");
    setMemberId("");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Borrow / Return Book</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Book ID"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />

        <input
          type="text"
          placeholder="Member ID"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />

        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="borrow">Borrow</option>
          <option value="return">Return</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserBorrowReturn;
