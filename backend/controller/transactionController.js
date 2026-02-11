// controllers/transactionController.js
const db = require("../config/database");

exports.borrowBook = async (req, res) => {
  const { bookId, memberId } = req.body;

  try {
    if (!bookId || !memberId) {
      return res.status(400).json({
        success: false,
        message: "Book ID and Member ID required"
      });
    }

    // 1️⃣ Check book
    const [books] = await db.execute(
      "SELECT * FROM books WHERE id = ?",
      [bookId]
    );

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }

    const book = books[0];

    if (book.available_copies <= 0) {
      return res.status(400).json({
        success: false,
        message: "No copies available"
      });
    }

    // 2️⃣ Insert transaction
    const [result] = await db.execute(
      `
      INSERT INTO transactions 
      (book_id, user_id, borrow_date, due_date, status)
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), 'borrowed')
      `,
      [bookId, memberId]
    );

    // result.insertId 👈 very important
    const transactionId = result.insertId;

    // 3️⃣ Reduce available copies
    await db.execute(
      `
      UPDATE books
      SET available_copies = available_copies - 1
      WHERE id = ?
      `,
      [bookId]
    );

    // 4️⃣ Fetch newly created transaction
    const [transactions] = await db.execute(
      `
      SELECT * FROM transactions WHERE id = ?
      `,
      [transactionId]
    );

    const newTransaction = transactions[0];

    return res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      transaction: newTransaction
    });

  } catch (err) {
    console.log("Borrow Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


exports.returnBook = async (req, res) => {
  const { transactionId } = req.body;

  try {
    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID required" });
    }

    // 1️⃣ Get transaction
    const [transactions] = await db.execute(
      "SELECT * FROM transactions WHERE id = ?",
      [transactionId]
    );

    if (transactions.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const transaction = transactions[0];

    if (transaction.status === "returned") {
      return res.status(400).json({ message: "Book already returned" });
    }

    // 2️⃣ Update transaction
    await db.execute(
      `
      UPDATE transactions
      SET return_date = NOW(),
          status = 'returned'
      WHERE id = ?
      `,
      [transactionId]
    );

    // 3️⃣ Increase available copies
    await db.execute(
      `
      UPDATE books
      SET available_copies = available_copies + 1
      WHERE id = ?
      `,
      [transaction.book_id]
    );

    res.json({ message: "Book returned successfully" });

  } catch (err) {
    console.log("Return Error:", err);
    res.status(500).json({ message: err.message });
  }
};


exports.getAllTransactions = async (req, res) => {
    try {
    const [transactions] = await db.execute(
    `   SELECT
        t.id,
        t.book_id,
        t.user_id,  
        t.borrow_date,
        t.due_date,
        t.return_date,
        t.status,
        b.title AS book_title,
        u.full_name AS member_name
        FROM transactions t
        JOIN books b ON t.book_id = b.id
        JOIN users u ON t.user_id = u.id
        ORDER BY t.borrow_date DESC
    `
    );

    console.log("Fetched Transactions:", transactions);

    res.json(transactions);
  } catch (err) {
    console.log("Error fetching transactions:", err);
    res.status(500).json({ message: err.message });
  }
}
