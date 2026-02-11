import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, User } from "lucide-react";

const MemberModal = ({ user, onClose, refresh }) => {
const [showModal, setShowModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);

const handleEdit = (user) => {
  setSelectedUser(user);
  setShowModal(true);
};


  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    role: "member",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        full_name: user.full_name || "",
        email: user.email || "",
        password: "",
        role: user.role || "member",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const validate = () => {
    const e = {};
    if (!formData.username.trim()) e.username = "Username required";
    if (!formData.full_name.trim()) e.full_name = "Full name required";
    if (!formData.email.trim()) e.email = "Email required";
    if (!user && !formData.password.trim()) e.password = "Password required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("library_token");

    try {
      if (user) {
        // UPDATE USER
        await axios.put(
          `http://localhost:3000/api/admin/users/${user.id}`,
          {
            username: formData.username,
            full_name: formData.full_name,
            role: formData.role,
            phone: formData.phone,
            address: formData.address,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // CREATE USER
        await axios.post(
          "http://localhost:3000/api/admin/users",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      refresh(); // reload users table
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <User className="text-blue-600 mr-2" />
            <h2 className="text-xl font-bold">
              {user ? "Edit User" : "Add User"}
            </h2>
          </div>
          <button onClick={onClose}><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <input
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

       <input
  placeholder="Email"
  value={formData.email}
  onChange={(e) =>
    setFormData({ ...formData, email: e.target.value })
  }
  readOnly={!!user}
  className={`w-full border px-3 py-2 rounded ${
    user ? "bg-gray-100 cursor-not-allowed" : ""
  }`}
/>



          {!user && (
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border px-3 py-2 rounded"
            />
          )}

          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
            <option value="member">Member</option>
          </select>

          <input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}>Cancel</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              {user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
