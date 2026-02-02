const express = require("express");
const router = express.Router();

const adminController = require("../controller/admin.controller");
const { authMiddleware, requireRole } = require("../middleware/auth");

// ADMIN USER MANAGEMENT
router.post(
  "/users",
  authMiddleware,
  requireRole("admin"),
  adminController.createUser
);

router.get(
  "/users",
  authMiddleware,
  requireRole("admin"),
  adminController.getAllUsers
);

router.get(
  "/users/:id",
  authMiddleware,
  requireRole("admin"),
  adminController.getUserById
);

router.put(
  "/users/:id",
  authMiddleware,
  requireRole("admin"),
  adminController.updateUser
);

router.put(
  "/users/:id/password",
  authMiddleware,
  requireRole("admin"),
  adminController.updatePassword
);

router.delete(
  "/users/:id",
  authMiddleware,
  requireRole("admin"),
  adminController.deleteUser
);

module.exports = router;
