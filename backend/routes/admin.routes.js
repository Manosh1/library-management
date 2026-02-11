const express = require("express");
const router = express.Router();

const adminController = require("../controller/admin.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");

const transactionController = require("../controller/transactionController");
// ADMIN USER MANAGEMENT
router.post(
  "/users",
  authMiddleware,
  requireRole("admin"),
  adminController.createUser,
);

router.get(
  "/users",
  authMiddleware,
  requireRole("admin"),
  adminController.getAllUsers,
);

router.delete(
  "/users",
  authMiddleware,
  requireRole("admin"),
  adminController.deleteUserById,
);

router.get(
  "/users/:id",
  authMiddleware,
  requireRole("admin"),
  adminController.getUserById,
);

router.put(
  "/users/:id",
  authMiddleware,
  requireRole("admin"),
  adminController.updateUser,
);

router.put(
  "/users/:id/password",
  authMiddleware,
  requireRole("admin"),
  adminController.updatePassword,
);

router.delete(
  "/users/:id",
  authMiddleware,
  requireRole("admin"),
  adminController.deleteUser,
);

router.post(
  "/transactions/borrow",
  authMiddleware,
  requireRole("admin"),
  transactionController.borrowBook,
);
router.post(
  "/transactions/return",
  authMiddleware,
  requireRole("admin"),
  transactionController.returnBook,
);

router.get(
  "/all-transactions",
  authMiddleware,
  requireRole("admin"),
  transactionController.getAllTransactions, );

module.exports = router;
