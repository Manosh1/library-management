const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    const { username, email, password, role, full_name, phone, address } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (username, email, password, role, full_name, phone, address) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.execute(query, [
      username, email, hashedPassword, role || 'member', 
      full_name || null, phone || null, address || null
    ]);
    
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await pool.execute(query, [email]);
    return rows[0];
  }

  // Find user by username
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await pool.execute(query, [username]);
    return rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, username, email, role, full_name, phone, address, created_at FROM users WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    return rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user
  static async update(id, userData) {
    const { full_name, phone, address } = userData;
    const query = `
      UPDATE users 
      SET full_name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const [result] = await pool.execute(query, [full_name, phone, address, id]);
    return result.affectedRows > 0;
  }

  // Change password
  static async changePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    const [result] = await pool.execute(query, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  // Get all users (for admin)
  static async getAll(limit = 10, offset = 0) {
    const query = `
      SELECT id, username, email, role, full_name, phone, address, created_at 
      FROM users 
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.execute(query, [limit, offset]);
    return rows;
  }
}

module.exports = User;