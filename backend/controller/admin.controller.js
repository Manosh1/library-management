const db = require("../config/database");
const bcrypt = require("bcrypt");

// ✅ CREATE USER (default role = member)
exports.createUser = async (req, res) => {
  try {
    const {
      username,
      full_name,
      email,
      password,
      role,
      phone,
      address,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `
      INSERT INTO users 
      (username, full_name, email, password, role, phone, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        username,
        full_name,
        email,
        hashedPassword,
        role || "member",
        phone || null,
        address || null,
      ]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email or username already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL USERS
exports.getAllUsers = async (req, res) => {
  const [users] = await db.execute(`
    SELECT 
      id,
      username,
      full_name,
      email,
      role,
      phone,
      address,
      created_at
    FROM users
    where role="member"
    ORDER BY created_at DESC
  `);

  res.json(users);
};

// ✅ GET SINGLE USER
exports.getUserById = async (req, res) => {
  const [rows] = await db.execute(
    `
    SELECT 
      id,
      username,
      full_name,
      email,
      role,
      phone,
      address
    FROM users
    WHERE id = ?
    `,
    [req.params.id]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(rows[0]);
};

// ✅ UPDATE USER (edit profile by admin)
exports.updateUser = async (req, res) => {
  const { username, full_name, role, phone, address } = req.body;

  await db.execute(
    `
    UPDATE users
    SET 
      username = ?,
      full_name = ?,
      role = ?,
      phone = ?,
      address = ?
    WHERE id = ?
    `,
    [username, full_name, role, phone, address, req.params.id]
  );

  res.json({ message: "User updated successfully" });
};

// ✅ RESET PASSWORD
exports.updatePassword = async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);

  await db.execute(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashed, req.params.id]
  );

  res.json({ message: "Password updated successfully" });
};

// ✅ DELETE USER (HARD DELETE)
exports.deleteUser = async (req, res) => {
  await db.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
  res.json({ message: "User deleted successfully" });
};
