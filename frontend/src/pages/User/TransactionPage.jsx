import React from "react";

const UserTransactions = () => {
  const transactions = [
    {
      id: 1,
      member: "Aayush Raj",
      book: "Atomic Habits",
      type: "Borrow",
      date: "2026-02-01",
    },
    {
      id: 2,
      member: "Rahul Kumar",
      book: "Clean Code",
      type: "Return",
      date: "2026-02-02",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3">Member</th>
            <th className="p-3">Book</th>
            <th className="p-3">Type</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id} className="border-t">
              <td className="p-3">{t.member}</td>
              <td className="p-3">{t.book}</td>
              <td
                className={`p-3 font-medium ${
                  t.type === "Borrow"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {t.type}
              </td>
              <td className="p-3">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTransactions;
