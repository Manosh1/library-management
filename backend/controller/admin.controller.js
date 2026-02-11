const db = require("../config/database");
const bcrypt = require("bcrypt");

// ✅ CREATE USER (default role = member)
exports.createUser = async (req, res) => {
  try {
    console.log("Incoming Data:", req.body);

    const {
      username,
      full_name,
      email,
      password,
      role,
      phone,
      address,
    } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    const result = await db.execute(
      `
      INSERT INTO users 
      (username, full_name, email, password, role, phone, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        username,
        full_name || null,
        email,
        hashedPassword,
        role || "member",
        phone || null,
        address || null,
      ]
    );

    console.log("Insert Result:", result);

    res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    console.log("DB ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUserById = async (req, res) => {
  const userId = req.query.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  await db.execute("DELETE FROM users WHERE id = ?", [userId]);
  res.json({ message: "User deleted successfully" });
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
      status,
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
      address,
      status,
      created_at
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
