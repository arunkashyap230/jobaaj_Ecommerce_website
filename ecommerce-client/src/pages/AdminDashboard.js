import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "./AdminDashboard.css";

const normalizeProductRating = (value) => {
  const rating = Number.parseFloat(String(value).replace(",", "."));

  if (Number.isNaN(rating)) {
    return 0;
  }

  return Math.min(5, Math.max(0, rating));
};

function AdminDashboard() {
  const { user } = useAuth();

  const navigate = useNavigate();

  const [tab, setTab] = useState("products");

  const [products, setProducts] = useState([]);

  const [orders, setOrders] = useState([]);

  const [users, setUsers] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editing, setEditing] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "Electronics",
    countInStock: "",
    rating: "0",
  });

  // Load Products, Orders & Users
  const loadData = useCallback(async () => {
    try {
      const productsRes = await api.get("/products");

      setProducts(productsRes.data);

      const ordersRes = await api.get("/orders");

      setOrders(ordersRes.data);

      const usersRes = await api.get("/users");

      setUsers(usersRes.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    loadData();
  }, [user, navigate, loadData]);

  // Upload Image
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    try {
      setUploading(true);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await api.post("/upload", formData, config);

      setForm((prev) => ({
        ...prev,
        image: data,
      }));

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.log(error);

      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Create / Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productPayload = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
        rating: normalizeProductRating(form.rating),
      };

      if (editing) {
        await api.put(`/products/${editing}`, productPayload);

        toast.success("Product updated");
      } else {
        await api.post("/products", productPayload);

        toast.success("Product created");
      }

      setShowForm(false);

      setEditing(null);

      setForm({
        name: "",
        price: "",
        description: "",
        image: "",
        category: "Electronics",
        countInStock: "",
        rating: "0",
      });

      loadData();
    } catch (err) {
      console.log(err);

      toast.error("Operation failed");
    }
  };

  // Edit Product
  const handleEdit = (p) => {
    setEditing(p._id);

    setForm({
      name: p.name,
      price: p.price,
      description: p.description,
      image: p.image,
      category: p.category,
      countInStock: p.countInStock,
      rating: p.rating || 0,
    });

    setShowForm(true);
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);

      toast.success("Deleted");

      loadData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);

      toast.success("User deleted");

      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "User delete failed");
    }
  };

  // Deliver Order
  const markDelivered = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);

      toast.success("Marked as delivered");

      loadData();
    } catch (error) {
      toast.error("Failed");
    }
  };

  return (
    <div className="admin-page fade-in">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        {/* STATS */}
        <div className="admin-stats">
          <div className="stat-card">
            <small>Total Products</small>

            <strong>{products.length}</strong>
          </div>

          <div className="stat-card">
            <small>Total Orders</small>

            <strong>{orders.length}</strong>
          </div>

          <div className="stat-card">
            <small>Total Users</small>

            <strong>{users.length}</strong>
          </div>

          <div className="stat-card">
            <small>Revenue</small>

            <strong>
              ₹{orders.reduce((s, o) => s + o.totalPrice, 0).toFixed(2)}
            </strong>
          </div>
        </div>

        {/* TABS */}
        <div className="admin-tabs">
          <button
            className={tab === "products" ? "active" : ""}
            onClick={() => setTab("products")}
          >
            Products
          </button>

          <button
            className={tab === "orders" ? "active" : ""}
            onClick={() => setTab("orders")}
          >
            Orders
          </button>

          <button
            className={tab === "users" ? "active" : ""}
            onClick={() => setTab("users")}
          >
            Users
          </button>
        </div>

        {/* PRODUCTS */}
        {tab === "products" && (
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowForm(!showForm);

                setEditing(null);
              }}
            >
              {showForm ? "Cancel" : "+ Add Product"}
            </button>

            {/* FORM */}
            {showForm && (
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name</label>

                    <input
                      className="form-input"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>

                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      required
                      value={form.price}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          price: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>

                    <select
                      className="form-select"
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value,
                        })
                      }
                    >
                      <option>Electronics</option>

                      <option>Fashion</option>

                      <option>Home</option>

                      <option>Books</option>

                      <option>Sports</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock</label>

                    <input
                      type="number"
                      className="form-input"
                      required
                      value={form.countInStock}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          countInStock: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rating (0-5)</label>

                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      inputMode="decimal"
                      className="form-input"
                      required
                      value={form.rating}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          rating: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* IMAGE */}
                <div className="form-group">
                  <label className="form-label">Upload Image</label>

                  <input
                    type="file"
                    className="form-input"
                    onChange={uploadFileHandler}
                  />

                  {uploading && <p>Uploading...</p>}

                  {form.image && (
                    <img
                      src={
                        form.image.startsWith("http")
                          ? form.image
                          : `http://localhost:5000${form.image}`
                      }
                      alt="preview"
                      style={{
                        width: "120px",
                        marginTop: "10px",
                        borderRadius: "10px",
                      }}
                    />
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>

                  <textarea
                    className="form-textarea"
                    rows="4"
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  {editing ? "Update" : "Create"} Product
                </button>
              </form>
            )}

            {/* PRODUCT TABLE */}
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>

                    <th>Name</th>

                    <th>Category</th>

                    <th>Price</th>

                    <th>Stock</th>

                    <th>Rating</th>

                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img src={p.image} alt={p.name} className="table-img" />
                      </td>

                      <td>
                        <strong>{p.name}</strong>
                      </td>

                      <td>{p.category}</td>

                      <td>₹{p.price.toFixed(2)}</td>

                      <td>{p.countInStock}</td>

                      <td>★ {Number(p.rating || 0).toFixed(1)}</td>

                      <td>
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>

                  <th>Customer</th>

                  <th>Date</th>

                  <th>Total</th>

                  <th>Status</th>

                  <th></th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>#{o._id.slice(-6).toUpperCase()}</td>

                    <td>{o.user?.name || "N/A"}</td>

                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>

                    <td>₹{o.totalPrice.toFixed(2)}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          o.isDelivered ? "delivered" : "pending"
                        }`}
                      >
                        {o.isDelivered ? "Delivered" : "Pending"}
                      </span>
                    </td>

                    <td>
                      {!o.isDelivered && (
                        <button
                          className="btn-icon"
                          onClick={() => markDelivered(o._id)}
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>

                  <th>Email</th>

                  <th>Role</th>

                  <th>Joined</th>

                  <th></th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <strong>{u.name}</strong>
                    </td>

                    <td>{u.email}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          u.isAdmin ? "delivered" : "pending"
                        }`}
                      >
                        {u.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>

                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>

                    <td>
                      {!u.isAdmin && (
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
