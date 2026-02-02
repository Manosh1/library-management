const db = require("../config/database");

// ➕ Add New Book
exports.addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      category,
      published_date,
      pages,
      total_copies,
      description,
    } = req.body;

    const query = `
      INSERT INTO books 
      (title, author, isbn, category, published_date, pages, total_copies, available_copies, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      title,
      author,
      isbn,
      category,
      published_date,
      pages,
      total_copies,
      total_copies,
      description,
    ]);

    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📚 Get All Books
exports.getBooks = async (req, res) => {
  try {
    const [books] = await db.execute(
      "SELECT * FROM books WHERE status = 'active'"
    );
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get Single Book
exports.getBookById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM books WHERE id = ?",
      [req.params.id]
    );

    if (!rows.length)
      return res.status(404).json({ message: "Book not found" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, category, pages, description } = req.body;

    await db.execute(
      `
      UPDATE books 
      SET title=?, author=?, category=?, pages=?, description=?
      WHERE id=?
      `,
      [title, author, category, pages, description, req.params.id]
    );

    res.json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Book (Soft Delete)
exports.deleteBook = async (req, res) => {
  try {
    await db.execute(
      "UPDATE books SET status='inactive' WHERE id=?",
      [req.params.id]
    );

    res.json({ message: "Book removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
